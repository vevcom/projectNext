'use server'
import { action } from '@/actions/action'
import { createJobAd } from '@/services/career/jobAds/create'

export const createJobAdAction = action(createJobAd)

