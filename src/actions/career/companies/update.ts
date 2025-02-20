'use server'
import { action } from '@/actions/action'
import { updateCompany } from '@/services/career/companies/update'

export const updateComanyAction = action(updateCompany)
