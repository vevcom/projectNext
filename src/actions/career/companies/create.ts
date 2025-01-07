'use server'
import { Action } from '@/actions/Action'
import { createCompany } from '@/services/career/companies/create'

export const createCompanyAction = Action(createCompany)
