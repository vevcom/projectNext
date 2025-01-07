'use server'
import { Action } from '@/actions/Action'
import { updateJobAd } from '@/services/career/jobAds/update'

export const updateJobAdAction = Action(updateJobAd)
