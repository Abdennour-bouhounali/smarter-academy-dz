/**
 * « الامتحان الأبيض » of lesson `talis-hisab-atwal` — its EXERCISE BANK, served AS IT IS (owner: « you will use the
 * exercises bank as it is »): `content/practice/4am/talis-hisab-atwal`, five levels of ten exam sheets, read through the
 * practice space's loader; the sheets' figures are drawn by the kit (`statement.figure`, K-a). The frame, the marking,
 * the evidence (re-computed by the server) are the kit's: `gameworld/kit/bankSitting.js`. Nothing of the bank is
 * written here.
 */
import { BANK_LEVELS, createBankSittings } from '../../../../../../common/gameworld/kit/bankSitting';

export const LEVELS = BANK_LEVELS;
export const sittings = createBankSittings({ lesson: 'talis-hisab-atwal', levels: LEVELS });
