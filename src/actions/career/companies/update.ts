'use server'
import { action } from '@/actions/action'
import { companyMethods } from '@/services/career/companies/methods'

export const updateComanyAction = action(companyMethods.update)
