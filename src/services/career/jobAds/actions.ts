'use server'

import { makeAction } from '@/services/serverAction'
import { jobAdOperations } from '@/services/career/jobAds/operations'

export const createJobAdAction = makeAction(jobAdOperations.create)

export const destroyJobAdAction = makeAction(jobAdOperations.destroy)

export const readJobAdAction = makeAction(jobAdOperations.read)
export const readActiveJobAdsAction = makeAction(jobAdOperations.readActive)
export const readInactiveJobAdsPageAction = makeAction(jobAdOperations.readInactivePage)

export const updateJobAdAction = makeAction(jobAdOperations.update)
