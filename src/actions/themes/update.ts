'use server'
import { Action } from '@/actions/Action'
import { Themes } from '@/services/themes'

export const updateThemeAction = Action(Themes.update)
