/**
 * THE LESSON'S TOOLS WITH NO WORLD — what arrives before they open: the lesson's CONTENT (its rules, its sheets, its
 * bank) and the student's journey when another device played further. NOT the world: no three.js is asked for
 * (owner, 2026-11-26 on the French platform, ported 2026-11-28; LESSON_V2.md §2bis). « مختبري » needs neither: it is
 * the lab of every lesson.
 */
import { Suspense, lazy, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../../context/AuthContext';
import { mathToPlain } from '../../../utils/mathPlain';
import { loadWorldContent } from '../../worldPreload';
import { pullSave } from './kit/saveSync';

const LessonTools = lazy(() => import('./kit/LessonTools'));
const LessonLab = lazy(() => import('../lessonlab/LessonLab'));

const Waiting = () => <div className="min-h-screen bg-slate-50" data-lesson-tools-loading />;

/** `tool`: 'practice' | 'knowledge' | 'lab' (lessons/lessonEntry.js › toolAsked). */
export default function LessonToolsLoader({ tool, config, exitTo, ...props }) {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const token = auth?.token ?? null;
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    if (tool === 'lab') return undefined;
    let alive = true;
    Promise.all([loadWorldContent(config.id), pullSave(token, config.id).catch(() => false)]).then(
      ([content]) => alive && (content ? setLesson(content) : navigate(exitTo, { replace: true })),
      () => alive && navigate(exitTo, { replace: true }),
    );
    return () => {
      alive = false;
    };
  }, [tool, config.id, token, navigate, exitTo]);

  if (tool === 'lab') {
    return (
      <Suspense fallback={<Waiting />}>
        <LessonLab lessonCode={config.id} lessonTitle={mathToPlain(config.title)} onClose={() => navigate(exitTo)} />
      </Suspense>
    );
  }
  if (!lesson) return <Waiting />;
  return (
    <Suspense fallback={<Waiting />}>
      <LessonTools tool={tool} lesson={lesson} config={config} exitTo={exitTo} {...props} />
    </Suspense>
  );
}
