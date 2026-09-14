'use server'

import { committeeParticipationOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const readCommitteeApplicationsInPeriodAction = makeAction(committeeParticipationOperations.read)
export const readCommitteeParticipatingPeriodAction = makeAction(committeeParticipationOperations.readAll)
