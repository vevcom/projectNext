'use server'
import { Action } from '@/actions/Action'
import { readActiveJobAds, readInactiveJobAdsPage, readJobAd } from '@/services/career/jobAds/read'

export const readJobAdAction = Action(readJobAd)
export const readActiveJobAdsAction = Action(readActiveJobAds)
export const readInactiveJobAdsPageAction = Action(readInactiveJobAdsPage)
