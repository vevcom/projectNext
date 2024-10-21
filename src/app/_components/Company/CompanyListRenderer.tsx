import type { CompanyExpanded } from '@/services/career/companies/Types'
import Company from './Company'
import { SessionMaybeUser } from '@/auth/Session'

/**
 * Used to render schools server side and client side in consistent way
 * @param asClient - If the company is rendered as a client
 * @param session - The session of the user used to determine if the user is an admin of the company
 * @returns A function that takes a company and returns a Company component
 */
// eslint-disable-next-line react/display-name
export const companyListRenderer = ({
    asClient, 
    session,
}: {
    asClient: boolean,
    session: SessionMaybeUser
}) => (company: CompanyExpanded) =>
    <Company session={session} key={company.id} company={company} asClient={asClient} />
