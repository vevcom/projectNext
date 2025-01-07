'use server'
import { Action } from '@/actions/Action'
import { createDot } from '@/services/dots/create'

export const createDotAction = Action(createDot)
