'use server'

import { action } from '@/actions/action'
import { destroyJobAd } from '@/services/career/jobAds/destroy'

export const destroyJobAdAction = action(destroyJobAd)
