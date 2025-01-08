'use server'
import { action } from '@/actions/action'
import { readCompanyPage } from '@/services/career/companies/read'

export const readCompanyPageAction = action(readCompanyPage)
