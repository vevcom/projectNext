'use server'

import { ledgerAccountOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const calculateLedgerAccountBalanceAction = makeAction(ledgerAccountOperations.calculateBalance)
export const readLedgerAccountPageAction = makeAction(ledgerAccountOperations.readPage)
