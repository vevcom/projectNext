'use server'
import { ThemeMethods } from '@/services/themes/methods'
import { action } from '@/actions/action'

export const readThemesAction = action(ThemeMethods.readAll)
export const readThemeAction = action(ThemeMethods.read)
