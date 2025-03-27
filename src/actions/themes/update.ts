'use server'
import { ThemeMethods } from '@/services/themes/methods'
import { action } from '@/actions/action'

export const updateThemeAction = action(ThemeMethods.update)
