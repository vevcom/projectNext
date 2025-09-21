'use server'

import { LedgerOperationMethods } from './methods'
import { action } from '@/services/action'

export const createDepositAction = action(LedgerOperationMethods.createDeposit)
export const createPayout = action(LedgerOperationMethods.createPayout)
