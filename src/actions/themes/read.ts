'use server'
import { ActionNoData } from '@/actions/Action'
import { Themes } from '@/services/themes'

export const readThemesAction = ActionNoData(Themes.readAll)
export const readThemeAction = ActionNoData(Themes.read)
