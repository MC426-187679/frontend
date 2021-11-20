import { Matcher } from 'features/search'

import DisciplinePage from './pages/Discipline'
import DisciplineLink from './components/Link'
import type { Discipline, Requirement } from './types/discipline'
import DisciplineMatch from './utils/match'

Matcher.register(DisciplineMatch)

export type { Discipline, Requirement }
export { DisciplineLink }
export default DisciplinePage
