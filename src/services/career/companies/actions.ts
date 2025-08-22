'use server'

import { action } from '@/actions/action'
import { CompanyMethods } from '@/services/career/companies/methods'

export const createCompanyAction = action(CompanyMethods.create)

export const destroyCompanyAction = action(CompanyMethods.destroy)

export const readCompanyPageAction = action(CompanyMethods.readPage)

export const updateComanyAction = action(CompanyMethods.update)
