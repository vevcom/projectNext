'use server'

import { LedgerAccountMethods } from './methods'
import { action } from '@/services/action'

export const calculateLedgerAccountBalanceAction = action(LedgerAccountMethods.calculateBalance)
export const readLedgerAccountPageAction = action(LedgerAccountMethods.readPage)
