'use server'
import { action } from '@/actions/action'
import { jobAdMethods } from '@/services/career/jobAds/methods'

export const createJobAdAction = action(jobAdMethods.create)

