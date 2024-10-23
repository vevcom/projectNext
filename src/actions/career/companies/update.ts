'use server'
import { Action } from '@/actions/Action'
import { Companies } from '@/services/career/companies'

export const updateComanyAction = Action(Companies.update)
