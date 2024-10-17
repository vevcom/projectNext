'use server'
import { Badges } from '@/services/users/badges'
import { Action } from '@/actions/Action'

export const createBadgeAction = Action(Badges.create)
