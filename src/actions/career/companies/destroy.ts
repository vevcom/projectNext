'use server'
import { Action } from '@/actions/Action'
import { destroyCompany } from '@/services/career/companies/destroy'

export const destroyCompanyAction = Action(destroyCompany)
