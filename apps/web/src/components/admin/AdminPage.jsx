/**
 * L'en-tête d'un écran d'administration — DÉMÉNAGÉ.
 *
 * Il vit maintenant dans `src/pages/admin/adminUi.jsx`, avec le reste du
 * chrome partagé du panneau (sections, cartes, états, boutons, libellés
 * arabes du kit) — pour la même raison que l'espace enseignant garde le sien
 * dans `pages/teacher/teacherUi.jsx` : l'en-tête, les états et les libellés
 * d'un espace se lisent ensemble, et les séparer avait fait diverger le
 * sur-titre de sa page.
 *
 * Ce fichier ne subsiste que comme RÉEXPORT, le temps qu'aucun appelant ne
 * l'importe plus. Les nouveaux écrans importent `adminUi` directement.
 *
 * @deprecated importer `{ AdminPage } from '../adminUi'`.
 */
export { AdminPage as default } from '../../pages/admin/adminUi';
