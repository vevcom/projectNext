'use server'

import { makeAction } from '@/services/serverAction'
import { LedgerOperationMethods } from './operations'

export const createDepositAction = makeAction(LedgerOperationMethods.createDeposit)
export const createPayout = makeAction(LedgerOperationMethods.createPayout)
