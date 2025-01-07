'use server'
import { Action } from '@/actions/Action'
import { createJobAd } from '@/services/career/jobAds/create'

export const createJobAdAction = Action(createJobAd)

