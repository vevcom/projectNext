'use server'
import { ActionNoData } from "../Action"
import { Themes } from "@/services/themes"

export const destroyThemeAction = ActionNoData(Themes.destroy)