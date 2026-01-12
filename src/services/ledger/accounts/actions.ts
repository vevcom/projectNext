'use server'

import { ledgerAccountOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const calculateLedgerAccountBalanceAction = makeAction(ledgerAccountOperations.calculateBalance)
export const readLedgerAccountAction = makeAction(ledgerAccountOperations.read)
export const readLedgerAccountPageAction = makeAction(ledgerAccountOperations.readPage)
export const updateLedgerAccountAction = makeAction(ledgerAccountOperations.update)

