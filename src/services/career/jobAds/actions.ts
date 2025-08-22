'use server'

import { action } from '@/services/action'
import { JobadMethods } from '@/services/career/jobAds/methods'

export const createJobAdAction = action(JobadMethods.create)

export const destroyJobAdAction = action(JobadMethods.destroy)

export const readJobAdAction = action(JobadMethods.read)
export const readActiveJobAdsAction = action(JobadMethods.readActive)
export const readInactiveJobAdsPageAction = action(JobadMethods.readInactivePage)

export const updateJobAdAction = action(JobadMethods.update)
