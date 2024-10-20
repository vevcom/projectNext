import type { CompanyExpanded } from '@/services/career/companies/Types'
import Company from './Company'

/**
 * Used to render schools server side and client side in consistent manner
 * @param school - school to render
 * @returns
 */
// eslint-disable-next-line react/display-name
export const companyListRenderer = (asClient: boolean) => (company: CompanyExpanded) =>
    <Company key={company.id} company={company} asClient={asClient} />
