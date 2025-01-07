'use server'

import { Action } from '@/actions/Action'
import { destroyJobAd } from '@/services/career/jobAds/destroy'

export const destroyJobAdAction = Action(destroyJobAd)
