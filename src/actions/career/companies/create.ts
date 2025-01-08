'use server'
import { action } from '@/actions/action'
import { createCompany } from '@/services/career/companies/create'

export const createCompanyAction = action(createCompany)
