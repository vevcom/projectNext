'use server'
import { Action } from '@/actions/Action'
import { Themes } from '@/services/themes'

export const createThemeAction = Action(Themes.create)
