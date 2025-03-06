'use server'
import { action } from '@/actions/action'
import { updateBadge } from '@/services/users/badges/update'

export const updateBadgeAction = action(updateBadge)
