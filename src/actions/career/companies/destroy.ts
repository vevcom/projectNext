'use server'
import { action } from '@/actions/action'
import { CompanyMethods } from '@/services/career/companies/methods'

export const destroyCompanyAction = action(CompanyMethods.destroy)
