'use server'
import { action } from '@/actions/action'
import { jobAdMethods } from '@/services/career/jobAds/methods'

export const readJobAdAction = action(jobAdMethods.read)
export const readActiveJobAdsAction = action(jobAdMethods.readActive)
export const readInactiveJobAdsPageAction = action(jobAdMethods.readInactivePage)
