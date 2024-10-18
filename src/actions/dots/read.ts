'use server'
import { ActionNoData } from '@/actions/Action'
import { Dots } from '@/services/dots'

export const readDotPage = ActionNoData(Dots.readPage)

export const readDotWrapperForUser = ActionNoData(Dots.readWrapperForUser)
