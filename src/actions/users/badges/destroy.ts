'use server'
import { action } from '@/actions/action'
import { destroyBadge } from '@/services/users/badges/destroy'

export const destroyBadgeAction = action(destroyBadge)
