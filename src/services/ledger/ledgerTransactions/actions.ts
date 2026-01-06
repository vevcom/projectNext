'use server'

import { LedgerTransactionMethods } from './operations'
import { action } from '@/services/action'

export const readLedgerTransactionPageAction = action(LedgerTransactionMethods.readPage)
