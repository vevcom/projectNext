'use server'

import { Dots } from "@/services/dots"
import { ActionNoData } from "../Action"

export const readDotPage = ActionNoData(Dots.readPage)