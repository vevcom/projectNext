'use server'
import { action } from '@/actions/action'
import { JobadMethods } from '@/services/career/jobAds/methods'

export const destroyJobAdAction = action(JobadMethods.destroy)
