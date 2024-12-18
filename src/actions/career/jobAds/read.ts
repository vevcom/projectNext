'use server'
import { ActionNoData } from '@/actions/Action'
import { JobAds } from '@/services/career/jobAds'

export const readJobAdAction = ActionNoData(JobAds.read)
export const readActiveJobAdsAction = ActionNoData(JobAds.readActive)
export const readInactiveJobAdsPageAction = ActionNoData(JobAds.readInactivePage)
