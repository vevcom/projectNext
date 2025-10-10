'use server'

import { action } from '@/services/action'
import { companyMethods } from '@/services/career/companies/methods'

export const createCompanyAction = action(companyMethods.create)

export const destroyCompanyAction = action(companyMethods.destroy)

export const readCompanyPageAction = action(companyMethods.readPage)

export const updateComanyAction = action(companyMethods.update)
