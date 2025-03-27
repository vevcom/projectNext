'use server'
import { action } from '@/actions/action'
import { JobadMethods } from '@/services/career/jobAds/methods'

export const updateJobAdAction = action(JobadMethods.update)
