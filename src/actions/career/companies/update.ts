'use server'
import { Action } from '@/actions/Action'
import { updateCompany } from '@/services/career/companies/update'

export const updateComanyAction = Action(updateCompany)
