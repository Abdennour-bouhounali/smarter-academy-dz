/**
 * PROTOTYPE page (dev builds only, `/__qa/mission-1`): mission 1 of the integration lesson of 4AM unit 1, for the owner
 * to play (`docs/reports/INTEGRATION_LESSON_PLAN.md` §6, step 1). The mission is played IN THE 3D DEPOT of the world.
 * Until the integration lesson has its own pack, this page MOUNTS the world itself, with the pilot lesson's content as
 * its host — no lesson page in between (its account, its launch kit and its saved journey do not matter here: the world
 * opens on a save of its own, `qa-mission-1`, and as a preview: nothing is sent). The situation's data is handed over
 * in the session's storage, read once by the world, which starts the mission by itself.
 */
import { useState } from 'react';
import DivisorIsles from '../../lessons/common/gameworld/divisorIsles/DivisorIsles';
import { lesson } from '../../lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/world';
import { LESSON_CONFIG } from '../../lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/qasim-adad-tabii/lesson.config';
import { BEM_2021 } from '../../lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/wadiya-idmajiya-aadad/missions/bem2021';

const CONFIG = { ...LESSON_CONFIG, id: 'qa-mission-1' };

export default function MissionPrototype() {
  // before the world is built (it reads the hand-over when it restores its save); again at every load of the page
  useState(() => sessionStorage.setItem('qa-mission', JSON.stringify(BEM_2021)));
  return (
    <DivisorIsles lesson={lesson} config={CONFIG} basePath="/__qa/mission-1" exitTo="/" completedModules={[]} preview />
  );
}
