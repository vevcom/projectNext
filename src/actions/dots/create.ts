'use server'
import { action } from '@/actions/action'
import { createDot } from '@/services/dots/create'

export const createDotAction = action(createDot)
