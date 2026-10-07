import { useTranslation } from 'react-i18next';

/**
 * « السلام عليكم عمر 🌿 » — LA salutation de l'élève et de l'enseignant,
 * écrite une seule fois (`common:islamic.greeting`). Le nom est celui du
 * compte (`getDisplayName`), jamais écrit en dur ; sans nom, la salutation
 * reste entière.
 *
 * `useIslamicGreeting` sert les pages qui attendent une CHAÎNE (le titre de
 * `TeacherPage`) ; `<IslamicGreeting>` les autres.
 */
export function useIslamicGreeting(name) {
  const { t } = useTranslation('common');
  return name ? t('islamic.greeting', { name }) : t('islamic.greetingAnonymous');
}

export default function IslamicGreeting({ name }) {
  return <span data-islamic-greeting>{useIslamicGreeting(name)}</span>;
}
