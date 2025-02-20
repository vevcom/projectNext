'use server'
import { action } from '@/actions/action'
import { updateJobAd } from '@/services/career/jobAds/update'

export const updateJobAdAction = action(updateJobAd)
