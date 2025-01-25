'use server'
import { action } from '@/actions/action'
import { createReleasePeriod } from '@/services/cabin/releasePeriod/create'
import { readReleasePeriods } from '@/services/cabin/releasePeriod/read'
import { updateReleasePeriod } from '@/services/cabin/releasePeriod/update'
import { deleteReleasePeriod } from '@/services/cabin/releasePeriod/delete'

export const createReleasePeriodAction = action(createReleasePeriod)
export const readReleasePeriodsAction = action(readReleasePeriods)
export const updateReleasePeriodAction = action(updateReleasePeriod)
export const deleteReleasePeriodAction = action(deleteReleasePeriod)
