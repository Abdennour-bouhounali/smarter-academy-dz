// « الامتحان الأبيض » of talis-hisab-atwal: the REAL bank (content/practice/4am/talis-hisab-atwal), served as it is —
// every level draws real sheets, every step of every sheet is markable to full points by its own answer key, « دج » only.
import { describeSitting } from '../../../../../../common/gameworld/kit/authoring/test/suites.js';
import { lesson } from './index';
import { LEVELS, sittings } from './sitting';

describeSitting({ id: 'talis-hisab-atwal', lesson, sittings, levels: LEVELS });
