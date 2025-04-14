'use server'
import { action } from '@/actions/action'
import { JobadMethods } from '@/services/career/jobAds/methods'

export const readJobAdAction = action(JobadMethods.read)
export const readActiveJobAdsAction = action(JobadMethods.readActive)
export const readInactiveJobAdsPageAction = action(JobadMethods.readInactivePage)
