'use server'
import { action } from '@/actions/action'
import { readActiveJobAds, readInactiveJobAdsPage, readJobAd } from '@/services/career/jobAds/read'

export const readJobAdAction = action(readJobAd)
export const readActiveJobAdsAction = action(readActiveJobAds)
export const readInactiveJobAdsPageAction = action(readInactiveJobAdsPage)
