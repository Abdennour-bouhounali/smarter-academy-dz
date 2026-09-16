import { lazy, Suspense } from 'react';
import { Route } from 'react-router-dom';
import { LESSON_CONFIG, LESSON_BASE_PATH } from './lesson.config';
import { LazyLessonKnowledgeProvider } from '../../../../common/knowledge/LazyKnowledgeProvider';

// La carte des connaissances est chargée À LA DEMANDE : elle n'est pas
// nécessaire pour APPARIER l'URL (les chemins viennent de lesson.config.js),
// seulement pour rendre la page.
const loadKnowledge = () => import('./knowledge');

const LessonHome = lazy(() => import('./index.jsx'));

// Module<NN><Descripteur>.jsx résolus par le NUMÉRO lu dans le nom de
// fichier (glob paresseux : un module absent ne fait disparaître que SA
// route, jamais l'application).
const MODULE_FILES = import.meta.glob('./modules/Module*.jsx');

const MODULE_COMPONENTS = Object.entries(MODULE_FILES).reduce((acc, [path, loader]) => {
  const match = path.match(/Module(\d+)/);
  if (match) acc[Number(match[1])] = lazy(loader);
  return acc;
}, {});

function withSuspense(Component) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <LazyLessonKnowledgeProvider
        load={loadKnowledge}
        lessonId={LESSON_CONFIG.id}
        printTitle="القاسم المشترك الأكبر"
        printSubject="الرياضيات · السنة الرابعة متوسط"
      >
        <Component />
      </LazyLessonKnowledgeProvider>
    </Suspense>
  );
}

/** Les routes de cette leçon, étalées dans le <Routes> de App.jsx. */
export default function pgcdRoutes() {
  return [
    <Route key="pgcd-index" path={LESSON_BASE_PATH} element={withSuspense(LessonHome)} />,
    ...LESSON_CONFIG.modules
      .map((m) => {
        const Component = MODULE_COMPONENTS[m.number];
        if (!Component) return null;
        return <Route key={`pgcd-${m.id}`} path={m.path} element={withSuspense(Component)} />;
      })
      .filter(Boolean),
  ];
}
