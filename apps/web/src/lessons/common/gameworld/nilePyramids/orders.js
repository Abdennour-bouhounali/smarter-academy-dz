/**
 * « الأهرامات » — THE ONE ORDER (PYRAMIDS_WORLD_PLAN §2.1, gate cut 1). Every order is ONE number he types; the world
 * builds one thing from it, and what it built is one of three FACTS. Pure: `order(kind, typed, truth)`.
 *
 *   canal   typed BEFORE the rope reads the canal     as · longer · shorter   (the rope's reading against his number)
 *   course  a course of a length, laid at its level   fits · gap · overhang
 *   mark    where a row already cut belongs (BM)      fits · gap · overhang   (the masons build up to his mark)
 *   ferry   a ferry rope thrown to the far post       ties · short · slack
 *   flight  a height h: Zero rises along the axis     apex · below · above
 *
 * No size of a gap, a shortfall or an overhang is part of a fact (gate P1): the sizes belong to the forge's mirror.
 * A missed order stays in the log; the next try is a new order of his own.
 */
import { typedLength, against, courseAt, write } from './logic';

const THREE_FACTS = {
  canal: ['shorter', 'as', 'longer'],
  course: ['gap', 'fits', 'overhang'],
  ferry: ['short', 'ties', 'slack'],
  flight: ['below', 'apex', 'above'],
};
export const FACTS = Object.freeze({ ...THREE_FACTS, mark: THREE_FACTS.course });

/** Is this fact the one the world wanted (the course fits, the rope reads as he typed…)? */
export const holds = (fact) => fact === 'as' || fact === 'fits' || fact === 'ties' || fact === 'apex';

/**
 * The world carries out his number. `truth` is what the world holds: the rope's reading (canal), the level's length
 * (course), `{ face, row }` (mark), the river's width (ferry), the pyramid's height (flight).
 * → { kind, typed, fact, built } — or { kind, refused: 'empty' | 'out' } when nothing can be built from it.
 */
export function order(kind, text, truth) {
  if (!FACTS[kind]) throw new Error(`nilePyramids: no order « ${kind} »`);
  const typed = typedLength(text);
  if (typed == null) return { kind, refused: 'empty' };
  if (kind === 'mark') {
    const { face, row } = truth;
    // the mark is on the edge, between the corner and the apex
    if (against(typed, face.edge) >= 0) return { kind, refused: 'out' };
    const level = courseAt(face, typed).MN; // the length of the level the masons build up to
    // the row he gave is laid on that level: shorter than the level leaves a gap, longer overhangs
    const c = against(row, level);
    return { kind, typed, fact: FACTS.mark[c + 1], built: { mark: typed, level, row: write(row) } };
  }
  const c = against(typed, truth);
  // a canal's fact speaks of the CANAL: the rope reads longer than he typed when his number is the shorter one
  const fact = kind === 'canal' ? FACTS.canal[1 - c] : FACTS[kind][c + 1];
  return { kind, typed, fact, built: { length: typed } };
}
