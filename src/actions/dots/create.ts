'use server'
import { Action } from '@/actions/Action'
import { Dots } from '@/services/dots'

export const createDotAction = Action(Dots.create)
