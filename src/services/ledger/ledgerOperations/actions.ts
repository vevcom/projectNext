'use server'

import { ledgerOperationOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const createDepositAction = makeAction(ledgerOperationOperations.createDeposit)
export const createPayout = makeAction(ledgerOperationOperations.createPayout)
