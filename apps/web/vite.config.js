import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [react()],
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
  optimizeDeps: {
    include: ['html-to-image'],
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
  css: {
    postcssOptions: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
})
