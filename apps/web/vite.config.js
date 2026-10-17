import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
import { fileURLToPath } from 'node:url'
import { readFileSync } from 'node:fs'
import sharePages from './vite-plugin-share-pages.js'

/**
 * Le contenu de pratique vit HORS de apps/web (content/practice, lu aussi par Laravel) : Vite ne le surveillait pas.
 * Un serveur de dev lancé avant qu'une banque soit ajoutée gardait l'ancien `active.json` / `index.generated.json` —
 * la carte « بنك تمارين هذا الدرس » manquait jusqu'au redémarrage (constaté le 2026-10-14 sur l'unité 3 1AM).
 * On ajoute le dossier au watcher : un fichier modifié ou ajouté recharge la page, comme une source.
 */
const PRACTICE_CONTENT = fileURLToPath(new URL('../../content/practice', import.meta.url))
function watchPracticeContent() {
  return {
    name: 'sa-watch-practice-content',
    configureServer(server) {
      server.watcher.add(PRACTICE_CONTENT)
    },
  }
}

export default defineConfig({
  // Pages de partage (aperçu WhatsApp/Facebook) des livres : BOOKS_STORE.md §6.
  plugins: [
    react(),
    watchPracticeContent(),
    sharePages({ cards: JSON.parse(readFileSync(new URL('./src/features/books/shareCards.json', import.meta.url), 'utf8')) }),
  ],
  build: {
    // Le rapport des tailles gzip de CHAQUE chunk (≈ 2 000 chunks : un par module
    // de leçon) faisait dépasser le tas de 4 Go du build (`npm run build`, CI) :
    // constaté le 2026-10-14 sur origin/dev, « heap out of memory » à « computing
    // gzip size ». Les tailles se mesurent à part (docs/architecture/BUNDLE_BOUNDARIES.md).
    reportCompressedSize: false,
  },
  // `html-to-image` n'est importé que dynamiquement (capture d'écran du
  // signalement) : sans cette ligne, Vite le découvre EN COURS de session,
  // ré-optimise ses dépendances, et chaque onglet déjà ouvert reçoit des 504
  // « Outdated Optimize Dep » sur ses chunks paresseux — les liens changent
  // l'URL mais la page ne suit plus. Pré-optimisé au démarrage, plus de surprise.
  // Même cause pour `mafs` (le graphe du héros de l'accueil, chargé en lazy) : découvert
  // à la première visite de « / », il déclenchait la même ré-optimisation et un 504 sur
  // `MafsGraph.jsx` (constaté le 2026-10-17).
  optimizeDeps: {
    include: ['html-to-image', 'mafs'],
  },
  resolve: {
    // UNE seule copie de KaTeX. react-katex et mafs déclarent katex ^0.16 et
    // npm leur installe une copie imbriquée (0.16.47) à côté de la nôtre
    // (0.18.2) : un élève qui ouvrait une leçon puis son cahier téléchargeait
    // les deux (≈ 2 × 260 Ko), et les formules des leçons étaient rendues par
    // 0.16 sous la feuille de style 0.18 — alors que check:katex valide les
    // leçons avec 0.18. Dédupliquer aligne le rendu sur ce qui est vérifié.
    // Voir docs/architecture/BUNDLE_BOUNDARIES.md.
    dedupe: ['katex'],
  },
  // Vitest : les textes des manipulations (`lesson:manipulation.*`) sont chargés
  // à la demande en production ; les tests les enregistrent d'emblée.
  test: {
    setupFiles: ['./src/test/setupLessonStrings.js'],
  },
  css: {
    postcssOptions: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
})
