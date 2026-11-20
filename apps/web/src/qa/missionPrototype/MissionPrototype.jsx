/**
 * PROTOTYPE page (dev builds only, `/__qa/mission-1`): mission 1 of the integration lesson of 4AM unit 1, for the owner to
 * play (`docs/reports/INTEGRATION_LESSON_PLAN.md` §6, step 1 — « mission 1 as a playable prototype → STOP: the owner plays
 * it »). It is not in the catalogue and no lesson links to it; the engine it mounts names no lesson.
 */
import { useNavigate } from 'react-router-dom';
import MissionPlayer from '../../lessons/common/gameworld/missions/MissionPlayer';
import { BEM_2021 } from '../../lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/wadiya-idmajiya-aadad/missions/bem2021';

export default function MissionPrototype() {
  const navigate = useNavigate();
  return <MissionPlayer situation={BEM_2021} onClose={() => navigate('/')} />;
}
