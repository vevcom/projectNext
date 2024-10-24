import Company from './Company'
import type { SessionMaybeUser } from '@/auth/Session'
import type { CompanyExpanded } from '@/services/career/companies/Types'

/**
 * Used to render schools server side and client side in consistent way
 * @param asClient - If the company is rendered as a client
 * @param session - The session of the user used to determine if the user is an admin of the company
 * @returns A function that takes a company and returns a Company component
 */
export const companyListRenderer = ({
    asClient,
    session,
    disableEditing = false
}: {
    asClient: boolean,
    session: SessionMaybeUser,
    disableEditing?: boolean
// eslint-disable-next-line react/display-name
}) => (company: CompanyExpanded) =>
    <Company disableEdit={disableEditing} session={session} key={company.id} company={company} asClient={asClient} />
