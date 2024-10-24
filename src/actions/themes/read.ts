'use server'
import { ActionNoData } from '@/actions/Action'
import { Themes } from '@/services/themes'

export const readThemeAction = ActionNoData(Themes.readAll)
export const readThemeAction = ActionNoData(Themes.read)
