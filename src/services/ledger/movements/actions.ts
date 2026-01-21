'use server'

import { ledgerMovementOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const createDepositAction = makeAction(ledgerMovementOperations.createDeposit)
export const createPayoutAction = makeAction(ledgerMovementOperations.createPayout)
