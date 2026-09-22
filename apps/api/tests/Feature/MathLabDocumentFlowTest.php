<?php

namespace Tests\Feature;

use App\Models\MathLabDocument;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

/**
 * Le مختبر الرياضيات : un élève crée, retrouve, modifie et supprime SES
 * documents — et seulement les siens. L'instrument est vérifié, la taille
 * bornée, et le propriétaire vient toujours de la session, jamais du corps.
 */
class MathLabDocumentFlowTest extends TestCase
{
    use RefreshDatabase;

    private User $student;

    private User $other;

    protected function setUp(): void
    {
        parent::setUp();
        $this->student = User::factory()->create(['role' => 'student']);
        $this->other = User::factory()->create(['role' => 'student']);
    }

    private function scene(int $strokes = 1): array
    {
        return [
            'elements' => array_fill(0, $strokes, ['type' => 'freedraw', 'x' => 10, 'y' => 20, 'points' => [[0, 0], [5, 5]]]),
            'appState' => ['viewBackgroundColor' => '#ffffff'],
            'files' => (object) [],
        ];
    }

    public function test_un_eleve_cree_un_tableau_et_le_retrouve_avec_son_etat(): void
    {
        $created = $this->actingAs($this->student)->postJson('/api/v1/math-lab/documents', [
            'tool' => 'whiteboard',
            'title' => '  رسم   المثلث  ',
            'schemaVersion' => 1,
            'data' => $this->scene(),
            // Ignoré : le propriétaire est l'élève authentifié.
            'userId' => $this->other->id,
        ]);

        $created->assertCreated()
            ->assertJsonPath('document.tool', 'whiteboard')
            ->assertJsonPath('document.title', 'رسم المثلث')
            ->assertJsonPath('document.schemaVersion', 1);

        $id = $created->json('document.id');
        $this->assertSame($this->student->id, MathLabDocument::find($id)->user_id);

        $this->actingAs($this->student)->getJson("/api/v1/math-lab/documents/{$id}")
            ->assertOk()
            ->assertJsonPath('document.data.appState.viewBackgroundColor', '#ffffff')
            ->assertJsonCount(1, 'document.data.elements');
    }

    public function test_le_grapheur_est_un_instrument_connu_avec_sa_propre_limite(): void
    {
        $data = [
            'functions' => [['id' => 'fn-1', 'name' => 'f', 'expression' => 'x^2', 'visible' => true, 'color' => '#2563eb', 'domain' => null]],
            'points' => [['id' => 'pt-1', 'name' => 'A', 'functionId' => 'fn-1', 'x' => 2]],
            'viewport' => ['xMin' => -8, 'xMax' => 8, 'yMin' => -6, 'yMax' => 6],
            'settings' => ['grid' => true],
        ];

        $created = $this->actingAs($this->student)->postJson('/api/v1/math-lab/documents', [
            'tool' => 'functionGrapher',
            'title' => 'منحنيات',
            'schemaVersion' => 1,
            'data' => $data,
        ]);

        $created->assertCreated()->assertJsonPath('document.tool', 'functionGrapher');
        $id = $created->json('document.id');

        $this->actingAs($this->student)->getJson("/api/v1/math-lab/documents/{$id}")
            ->assertOk()
            ->assertJsonPath('document.data.functions.0.expression', 'x^2')
            ->assertJsonPath('document.data.points.0.x', 2)
            ->assertJsonPath('document.data.viewport.xMax', 8);

        // 100 Ko : bien plus qu'un grapheur n'en produit, bien moins que la سبّورة.
        $this->actingAs($this->student)->patchJson("/api/v1/math-lab/documents/{$id}", [
            'data' => ['functions' => [['expression' => str_repeat('x+', 60_000)]]],
        ])->assertStatus(422)->assertJsonPath('code', 'math_lab_document_too_large');
    }

    public function test_la_geometrie_3d_est_un_instrument_connu_avec_sa_propre_limite(): void
    {
        $data = [
            'shape' => 'cuboid',
            'dimensions' => ['length' => 4, 'width' => 2, 'height' => 3],
            'showAxes' => true,
            'showGrid' => false,
            'showMeasurements' => true,
            'camera' => ['position' => [-6.2, 4.9, 8.1], 'target' => [2, 1.5, -1]],
        ];

        $created = $this->actingAs($this->student)->postJson('/api/v1/math-lab/documents', [
            'tool' => 'geometry3d',
            'title' => 'مجسّمات',
            'schemaVersion' => 1,
            'data' => $data,
        ]);

        $created->assertCreated()->assertJsonPath('document.tool', 'geometry3d');
        $id = $created->json('document.id');

        $this->actingAs($this->student)->getJson("/api/v1/math-lab/documents/{$id}")
            ->assertOk()
            ->assertJsonPath('document.data.shape', 'cuboid')
            ->assertJsonPath('document.data.dimensions.length', 4)
            ->assertJsonPath('document.data.showGrid', false)
            ->assertJsonPath('document.data.camera.target.0', 2);

        // 20 Ko : bien plus qu'un solide n'en produit.
        $this->actingAs($this->student)->patchJson("/api/v1/math-lab/documents/{$id}", [
            'data' => ['shape' => 'cube', 'note' => str_repeat('x', 25_000)],
        ])->assertStatus(422)->assertJsonPath('code', 'math_lab_document_too_large');
    }

    public function test_les_probabilites_et_statistiques_sont_un_instrument_connu_avec_sa_propre_limite(): void
    {
        // Ce que l'outil enregistre vraiment : des EFFECTIFS et une graine,
        // jamais les tirages — cent mille lancers tiennent dans six nombres.
        $data = [
            'mode' => 'experiment',
            'experiment' => 'die',
            'range' => ['min' => 1, 'max' => 20],
            'draws' => 1000,
            'simulation' => [
                'experimentId' => 'die', 'seed' => 12345, 'total' => 100000, 'drawn' => 100000,
                'counts' => [16702, 16611, 16689, 16598, 16745, 16655],
                'trajectory' => [['n' => 1, 'frequency' => 0], ['n' => 100000, 'frequency' => 0.16702]],
            ],
            'dataset' => '12 ; 15 ; 14 ; 18 ; 10 ; 12 ; 16',
            'settings' => ['compare' => true, 'showMean' => true, 'showMedian' => false],
        ];

        $created = $this->actingAs($this->student)->postJson('/api/v1/math-lab/documents', [
            'tool' => 'probabilityStats',
            'title' => 'احتمالات وإحصاء',
            'schemaVersion' => 1,
            'data' => $data,
        ]);

        $created->assertCreated()->assertJsonPath('document.tool', 'probabilityStats');
        $id = $created->json('document.id');

        $this->actingAs($this->student)->getJson("/api/v1/math-lab/documents/{$id}")
            ->assertOk()
            ->assertJsonPath('document.data.experiment', 'die')
            ->assertJsonPath('document.data.simulation.total', 100000)
            ->assertJsonPath('document.data.simulation.counts.0', 16702)
            ->assertJsonPath('document.data.settings.showMedian', false);

        // 60 Ko : bien plus qu'une expérience et une série de 500 valeurs n'en produisent.
        $this->actingAs($this->student)->patchJson("/api/v1/math-lab/documents/{$id}", [
            'data' => ['mode' => 'dataset', 'dataset' => str_repeat('1 ; ', 20_000)],
        ])->assertStatus(422)->assertJsonPath('code', 'math_lab_document_too_large');
    }

    public function test_la_liste_ne_montre_que_mes_documents_sans_leur_etat(): void
    {
        MathLabDocument::create(['user_id' => $this->student->id, 'tool' => 'whiteboard', 'title' => 'A', 'data' => $this->scene()]);
        MathLabDocument::create(['user_id' => $this->other->id, 'tool' => 'whiteboard', 'title' => 'B', 'data' => $this->scene()]);

        $response = $this->actingAs($this->student)->getJson('/api/v1/math-lab/documents');

        $response->assertOk()
            ->assertJsonCount(1, 'documents')
            ->assertJsonPath('documents.0.title', 'A')
            ->assertJsonMissingPath('documents.0.data');
    }

    public function test_la_liste_se_filtre_par_instrument(): void
    {
        MathLabDocument::create(['user_id' => $this->student->id, 'tool' => 'whiteboard', 'title' => 'A', 'data' => $this->scene()]);

        $this->actingAs($this->student)->getJson('/api/v1/math-lab/documents?tool=whiteboard')->assertOk()->assertJsonCount(1, 'documents');
        $this->actingAs($this->student)->getJson('/api/v1/math-lab/documents?tool=graph')->assertOk()->assertJsonCount(0, 'documents');
    }

    public function test_le_document_d_un_autre_eleve_est_introuvable(): void
    {
        $document = MathLabDocument::create(['user_id' => $this->other->id, 'tool' => 'whiteboard', 'title' => 'B', 'data' => $this->scene()]);

        $this->actingAs($this->student)->getJson("/api/v1/math-lab/documents/{$document->id}")->assertNotFound();
        $this->actingAs($this->student)->patchJson("/api/v1/math-lab/documents/{$document->id}", ['title' => 'X'])->assertNotFound();
        $this->actingAs($this->student)->deleteJson("/api/v1/math-lab/documents/{$document->id}")->assertNotFound();

        $this->assertSame('B', $document->fresh()->title);
    }

    public function test_modifier_change_le_titre_et_l_etat_mais_jamais_l_instrument(): void
    {
        $document = MathLabDocument::create(['user_id' => $this->student->id, 'tool' => 'whiteboard', 'title' => 'A', 'data' => $this->scene()]);

        $this->actingAs($this->student)->patchJson("/api/v1/math-lab/documents/{$document->id}", [
            'title' => 'الدائرة',
            'data' => $this->scene(3),
            'tool' => 'graph',
        ])->assertOk()
            ->assertJsonPath('document.title', 'الدائرة')
            ->assertJsonMissingPath('document.data');

        $fresh = $document->fresh();
        $this->assertSame('whiteboard', $fresh->tool);
        $this->assertCount(3, $fresh->data['elements']);
        $this->assertGreaterThan(0, $fresh->data_bytes);
    }

    public function test_un_instrument_inconnu_est_refuse(): void
    {
        $this->actingAs($this->student)->postJson('/api/v1/math-lab/documents', [
            'tool' => 'graph',
            'title' => 'x',
            'data' => $this->scene(),
        ])->assertStatus(422)->assertJsonPath('code', 'math_lab_unknown_tool');
    }

    public function test_un_etat_trop_lourd_est_refuse(): void
    {
        $heavy = ['blob' => str_repeat('x', 2_100_000)];

        $this->actingAs($this->student)->postJson('/api/v1/math-lab/documents', [
            'tool' => 'whiteboard',
            'title' => 'x',
            'data' => $heavy,
        ])->assertStatus(422)->assertJsonPath('code', 'math_lab_document_too_large');

        $document = MathLabDocument::create(['user_id' => $this->student->id, 'tool' => 'whiteboard', 'title' => 'A', 'data' => $this->scene()]);
        $this->actingAs($this->student)->patchJson("/api/v1/math-lab/documents/{$document->id}", ['data' => $heavy])
            ->assertStatus(422)->assertJsonPath('code', 'math_lab_document_too_large');
    }

    public function test_supprimer_retire_le_document(): void
    {
        $document = MathLabDocument::create(['user_id' => $this->student->id, 'tool' => 'whiteboard', 'title' => 'A', 'data' => $this->scene()]);

        $this->actingAs($this->student)->deleteJson("/api/v1/math-lab/documents/{$document->id}")->assertOk();
        $this->assertNull($document->fresh());
    }

    public function test_un_visiteur_est_refuse(): void
    {
        $this->getJson('/api/v1/math-lab/documents')->assertUnauthorized();
    }
}
