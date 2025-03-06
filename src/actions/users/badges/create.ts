'use server'
import { createBadge } from '@/services/users/badges/create'
import { action } from '@/actions/action'


export const createBadgeAction = action(createBadge)
