'use server'
import { Action, ActionNoData } from '@/actions/Action'
import { Cabin } from '@/services/cabin'

export const createReleasePeriodAction = Action(Cabin.createReleasePeriod)
export const readReleasePeriodsAction = ActionNoData(Cabin.readReleasePeriod)
export const updateReleasePeriodAction = Action(Cabin.updateReleasePeriod)
export const deleteReleasePeriodAction = ActionNoData(Cabin.deleteReleasePeriod)
