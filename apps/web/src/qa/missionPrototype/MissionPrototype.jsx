/**
 * PROTOTYPE launcher (dev builds only, `/__qa/mission-1`): mission 1 of the integration lesson of 4AM unit 1, for the
 * owner to play (`docs/reports/INTEGRATION_LESSON_PLAN.md` §6, step 1). The mission is played IN THE 3D DEPOT of the
 * world; until the integration lesson has its own pack, a v2 lesson of the unit hosts it: this page hands the situation
 * over (`window.__qaMission`, read once by the world when the student presses « ابدأ ») and opens that lesson.
 */
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BEM_2021 } from '../../lessons/moyen/4am/ansab_al_aadad_wal_hisab/aadad-tabiiya-natiqa/wadiya-idmajiya-aadad/missions/bem2021';

const HOST = '/courses/moyen/4am/ansab_al_aadad_wal_hisab/qasim-adad-tabii';

export default function MissionPrototype() {
  const navigate = useNavigate();
  useEffect(() => {
    window.__qaMission = BEM_2021;
    navigate(HOST);
  }, [navigate]);
  return null;
}
