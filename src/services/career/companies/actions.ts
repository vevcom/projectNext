'use server'

import { action } from '@/services/action'
import { companyOperations } from '@/services/career/companies/operations'

export const createCompanyAction = action(companyOperations.create)

export const destroyCompanyAction = action(companyOperations.destroy)

export const readCompanyPageAction = action(companyOperations.readPage)

export const updateComanyAction = action(companyOperations.update)
