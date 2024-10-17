'use server'
import { Action } from '@/actions/Action'
import { Badges } from '@/services/users/badges'

export const updateBadgeAction = Action(Badges.update)
