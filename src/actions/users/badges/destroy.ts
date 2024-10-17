'use server'
import { ActionNoData } from '@/actions/Action'
import { Badges } from '@/services/users/badges'

export const destroyBadgeAction = ActionNoData(Badges.destroy)
