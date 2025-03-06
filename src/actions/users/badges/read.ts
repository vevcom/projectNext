'use server'
import { action } from '@/actions/action'
import { readAllBadges,readBadge } from '@/services/users/badges/read'

export const readAllBadgesAction = action(readAllBadges)
export const readBadgeAction = action(readBadge)
