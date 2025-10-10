'use server'

import { action } from '@/services/action'
import { jobAdMethods } from '@/services/career/jobAds/methods'

export const createJobAdAction = action(jobAdMethods.create)

export const destroyJobAdAction = action(jobAdMethods.destroy)

export const readJobAdAction = action(jobAdMethods.read)
export const readActiveJobAdsAction = action(jobAdMethods.readActive)
export const readInactiveJobAdsPageAction = action(jobAdMethods.readInactivePage)

export const updateJobAdAction = action(jobAdMethods.update)
