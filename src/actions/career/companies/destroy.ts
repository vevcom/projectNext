'use server'
import { action } from '@/actions/action'
import { destroyCompany } from '@/services/career/companies/destroy'

export const destroyCompanyAction = action(destroyCompany)
