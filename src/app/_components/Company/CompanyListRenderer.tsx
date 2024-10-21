import type { CompanyExpanded } from '@/services/career/companies/Types'
import Company from './Company'

/**
 * Used to render schools server side and client side in consistent way
 * @param asClient - If the company is rendered as a client
 * @returns A function that takes a company and returns a Company component
 */
// eslint-disable-next-line react/display-name
export const companyListRenderer = (asClient: boolean) => (company: CompanyExpanded) =>
    <Company key={company.id} company={company} asClient={asClient} />
