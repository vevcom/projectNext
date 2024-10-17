'use server'
import { ActionNoData } from '@/actions/Action'
import { Badges } from '@/services/users/badges'

export const readAllBadgesAction = ActionNoData(Badges.readAll)
export const readBadgeAction = ActionNoData(Badges.read)
