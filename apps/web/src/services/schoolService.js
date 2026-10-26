import { call, get } from './teacher/teacherClient';

/**
 * Transport de « فضاء الإدارة » (docs/architecture/SCHOOL_ADMIN_SPACE.md). Même
 * convention que les services enseignant et famille : jeton en premier
 * argument, erreur arabe (`common.apiErrors.idara`) et motif clos `reason`
 * (`no_school`), traduit par la page sous `idara:errors.*`.
 */
const KEY = 'idara';

export const fetchSchoolOverview = (token) => call('/school/overview', get(token), KEY);
