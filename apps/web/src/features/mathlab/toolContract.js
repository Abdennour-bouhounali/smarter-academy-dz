/**
 * Le CONTRAT d'un instrument du مختبر الرياضيات (Math Lab).
 *
 * Le mختبر est une famille d'instruments indépendants — la سبّورة
 * aujourd'hui, le grapheur, la géométrie, les أشعة demain. Ce fichier dit ce
 * qu'un instrument doit fournir pour se brancher sur la coquille commune
 * (MathLabShell), le registre (toolRegistry.js) et la persistance
 * (useMathLabDocument) SANS que ceux-ci changent. Voir
 * docs/architecture/MATH_LAB.md.
 *
 * @typedef {object} MathLabTool
 * @property {string} id
 *   Identifiant stable, en camelCase ('whiteboard'). C'est la valeur de
 *   `tool` en base : le registre SERVEUR (App\Domain\MathLab\MathLabTools)
 *   doit le connaître, sinon la sauvegarde est refusée.
 * @property {string} slug
 *   Le segment d'URL, en français comme le reste des routes de l'espace
 *   ('tableau' → /espace/atelier/tableau).
 * @property {string} labelKey
 *   Clé i18n du nom, namespace `mathlab` ('tools.whiteboard.name').
 * @property {string} descriptionKey
 * @property {string} newLabelKey        Le libellé du bouton « nouveau » sur l'accueil.
 * @property {string} defaultTitleKey    Le titre d'un document jamais renommé.
 * @property {import('react').ComponentType<{size?: number, className?: string}>} icon
 *   Une icône lucide, jamais une image.
 * @property {number} schemaVersion
 *   La version du FORMAT de `data`. L'outil doit savoir rouvrir toute
 *   version antérieure qu'il a publiée ; le serveur ne l'interprète pas.
 * @property {(seed?: unknown) => object} createInitialData
 *   L'état d'un document neuf — vide, ou construit depuis l'amorce qu'une
 *   leçon transmet (openMathLab.js).
 * @property {() => Promise<{default: import('react').ComponentType<MathLabToolProps>}>} load
 *   L'import PARESSEUX du composant : un instrument lourd (la سبّورة embarque
 *   Excalidraw) ne pèse sur aucune autre page.
 */

/**
 * Ce que la coquille passe au composant d'un instrument.
 *
 * @typedef {object} MathLabToolProps
 * @property {object} initialData   L'état du document au moment de l'ouverture — lu UNE fois.
 * @property {string} title         Le titre courant (nom d'export, accessibilité).
 * @property {(data: object) => void} onChange
 *   À appeler avec le NOUVEL état sérialisé (JSON pur) à chaque changement
 *   de contenu. La coquille se charge du délai et de la sauvegarde.
 * @property {(api: MathLabToolApi | null) => void} onReady
 *   Expose les actions que la coquille peut offrir dans sa barre. Toutes
 *   sont FACULTATIVES : la coquille n'affiche que celles qui existent.
 * @property {{files: MathLabAttachment[], loadBlob: (file: MathLabAttachment) => Promise<Blob>}} [attachments]
 *   Les FICHIERS du document (serveur), pour un outil qui déclare la
 *   capacité `attachments` : la liste à jour, et de quoi lire les octets.
 * @property {(notice: {tone: 'success'|'error', key: string, params?: object} | null) => void} [onNotice]
 *   Un mot pour l'élève, affiché par la coquille sous la barre (clé i18n du
 *   namespace `mathlab`).
 */

/**
 * Un fichier d'un document, tel que le serveur le rend
 * (App\Http\Controllers\MathLabFileController::serialize).
 *
 * @typedef {object} MathLabAttachment
 * @property {number} id
 * @property {number} documentId
 * @property {'image'|'svg'|'pdf'} kind
 * @property {string} name
 * @property {string} mimeType
 * @property {number} size
 * @property {string|null} createdAt
 */

/**
 * @typedef {object} MathLabToolApi
 * @property {() => void} [clear]                  Vider le document (la coquille demande confirmation).
 * @property {() => Promise<Blob>} [exportPng]     Le rendu en image, pour « تصدير صورة ».
 * @property {() => boolean} [isGridEnabled]
 * @property {() => boolean} [toggleGrid]       Bascule la grille et rend le NOUVEL état.
 * @property {MathLabAttachmentsCapability} [attachments]
 *   La capacité « fichiers » : sa présence fait apparaître « الملفات » dans la
 *   barre et le panneau des fichiers (attachments/AttachmentsPanel.jsx).
 */

/**
 * Ce qu'un outil sait faire des fichiers. Le panneau tient l'envoi, la
 * liste, les quotas et la suppression (serveur) ; l'outil ne tient que ce
 * qui touche à son canevas.
 *
 * @typedef {object} MathLabAttachmentsCapability
 * @property {string} accept
 *   Les types que le sélecteur propose (attachmentPolicy.ATTACHMENT_ACCEPT).
 * @property {(file: File) => Promise<{count: number}>} [importFile]
 *   Fond un fichier NON stocké (bibliothèque, dessin) dans l'outil. Rejette
 *   avec une erreur portant `code` (`shell.importErrors.<code>`) et `cause`.
 * @property {(file: MathLabAttachment) => boolean} [canPlace]
 *   Ce fichier peut-il être posé sur le canevas ?
 * @property {(file: MathLabAttachment, blob: Blob) => Promise<void>} [place]
 * @property {(file: MathLabAttachment) => void} [forget]
 *   Le fichier vient d'être supprimé : ce qui le montrait disparaît.
 */

const REQUIRED = ['id', 'slug', 'labelKey', 'descriptionKey', 'newLabelKey', 'defaultTitleKey', 'icon', 'schemaVersion', 'createInitialData', 'load'];

/**
 * Valide et fige la définition d'un instrument. Une définition incomplète
 * échoue AU CHARGEMENT du registre, pas au premier clic d'un élève.
 *
 * @param {MathLabTool} definition
 * @returns {Readonly<MathLabTool>}
 */
export function defineMathLabTool(definition) {
  for (const key of REQUIRED) {
    if (definition[key] === undefined || definition[key] === null) {
      throw new Error(`[mathlab] l'instrument « ${definition.id ?? '?'} » n'a pas de « ${key} »`);
    }
  }
  if (!/^[a-z][a-zA-Z0-9]*$/.test(definition.id)) {
    throw new Error(`[mathlab] identifiant invalide « ${definition.id} » (camelCase attendu)`);
  }
  if (!/^[a-z][a-z0-9-]*$/.test(definition.slug)) {
    throw new Error(`[mathlab] segment d'URL invalide « ${definition.slug} » pour « ${definition.id} »`);
  }
  if (!Number.isInteger(definition.schemaVersion) || definition.schemaVersion < 1) {
    throw new Error(`[mathlab] schemaVersion doit être un entier ≥ 1 pour « ${definition.id} »`);
  }
  if (typeof definition.createInitialData !== 'function' || typeof definition.load !== 'function') {
    throw new Error(`[mathlab] createInitialData et load doivent être des fonctions pour « ${definition.id} »`);
  }

  return Object.freeze({ ...definition });
}
