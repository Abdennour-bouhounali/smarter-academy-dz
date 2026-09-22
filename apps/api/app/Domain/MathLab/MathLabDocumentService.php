<?php

namespace App\Domain\MathLab;

use App\Models\MathLabDocument;
use App\Models\User;
use DomainException;
use Illuminate\Support\Collection;

/**
 * Les documents du مختبر الرياضيات — le travail libre de l'élève.
 *
 * Même règle que le cahier (NotebookService) : toute lecture est filtrée par
 * `user_id`, qui vient de l'élève AUTHENTIFIÉ et jamais de la requête ; le
 * document d'autrui est « introuvable » plutôt qu'« interdit », pour ne pas
 * révéler son existence.
 *
 * Le serveur ne comprend pas `data` : c'est l'état d'un instrument, que seul
 * cet instrument sait lire. Il n'en vérifie que deux choses — l'instrument
 * existe (MathLabTools) et la taille reste dans sa borne. L'instrument d'un
 * document ne change jamais : un dessin ne devient pas un graphe.
 */
class MathLabDocumentService
{
    public function __construct(private MathLabFileService $files) {}

    public const NOT_FOUND = 'math_lab_document_not_found';

    public const UNKNOWN_TOOL = 'math_lab_unknown_tool';

    public const TOO_LARGE = 'math_lab_document_too_large';

    /** « Mes travaux » : sans `data`, du plus récent au plus ancien. */
    public function listFor(User $user, ?string $tool = null): Collection
    {
        return MathLabDocument::query()
            ->select(MathLabDocument::SUMMARY_COLUMNS)
            ->where('user_id', $user->id)
            ->when($tool, fn ($q) => $q->where('tool', $tool))
            ->orderByDesc('updated_at')
            ->orderByDesc('id')
            ->get();
    }

    public function find(User $user, int $id): MathLabDocument
    {
        $document = MathLabDocument::query()
            ->where('user_id', $user->id)
            ->find($id);

        if (! $document) {
            throw new DomainException(self::NOT_FOUND);
        }

        return $document;
    }

    /**
     * @param array{tool: string, title: string, data: array, schemaVersion?: int} $attributes
     */
    public function create(User $user, array $attributes): MathLabDocument
    {
        $tool = $attributes['tool'];
        if (! MathLabTools::exists($tool)) {
            throw new DomainException(self::UNKNOWN_TOOL);
        }

        $bytes = $this->measure($tool, $attributes['data']);

        return MathLabDocument::create([
            'user_id' => $user->id,
            'tool' => $tool,
            'title' => $this->cleanTitle($attributes['title']),
            'schema_version' => $attributes['schemaVersion'] ?? 1,
            'data' => $attributes['data'],
            'data_bytes' => $bytes,
        ]);
    }

    /**
     * Le titre et l'état — jamais l'instrument, jamais le propriétaire.
     *
     * @param array{title?: string, data?: array, schemaVersion?: int} $attributes
     */
    public function update(User $user, int $id, array $attributes): MathLabDocument
    {
        $document = $this->find($user, $id);

        if (array_key_exists('title', $attributes)) {
            $document->title = $this->cleanTitle($attributes['title']);
        }
        if (array_key_exists('data', $attributes)) {
            $document->data_bytes = $this->measure($document->tool, $attributes['data']);
            $document->data = $attributes['data'];
        }
        if (array_key_exists('schemaVersion', $attributes)) {
            $document->schema_version = $attributes['schemaVersion'];
        }

        $document->save();

        return $document;
    }

    public function delete(User $user, int $id): void
    {
        $document = $this->find($user, $id);
        // Les lignes de fichiers partent en cascade ; leurs octets, ici.
        $this->files->deleteAllFor($document);
        $document->delete();
    }

    /** La taille de l'état, en octets de JSON — et le refus si elle dépasse la borne de l'outil. */
    private function measure(string $tool, array $data): int
    {
        $bytes = strlen((string) json_encode($data, JSON_UNESCAPED_UNICODE));
        if ($bytes > MathLabTools::maxBytes($tool)) {
            throw new DomainException(self::TOO_LARGE);
        }

        return $bytes;
    }

    private function cleanTitle(string $title): string
    {
        $clean = trim((string) preg_replace('/\s+/u', ' ', $title));

        return $clean === '' ? 'بدون عنوان' : mb_substr($clean, 0, 160);
    }
}
