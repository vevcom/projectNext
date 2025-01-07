'use server'
import { Action } from '@/actions/Action'
import { readCompanyPage } from '@/services/career/companies/read'

export const readCompanyPageAction = Action(readCompanyPage)
