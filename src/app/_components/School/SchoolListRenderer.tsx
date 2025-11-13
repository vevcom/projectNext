import School from './School'
import type { ExpandedSchool } from '@/services/education/schools/types'

/**
 * Used to render schools server side and client side in consistent manner
 * @param school - school to render
 * @returns
 */
// eslint-disable-next-line react/display-name
export const schoolListRenderer = (asClient: boolean) => (school: ExpandedSchool) =>
    <School key={school.shortName} asClient={asClient} school={school} />
