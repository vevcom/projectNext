'use server'

import { action } from '@/services/action'
import { jobAdOperations } from '@/services/career/jobAds/operations'

export const createJobAdAction = action(jobAdOperations.create)

export const destroyJobAdAction = action(jobAdOperations.destroy)

export const readJobAdAction = action(jobAdOperations.read)
export const readActiveJobAdsAction = action(jobAdOperations.readActive)
export const readInactiveJobAdsPageAction = action(jobAdOperations.readInactivePage)

export const updateJobAdAction = action(jobAdOperations.update)
