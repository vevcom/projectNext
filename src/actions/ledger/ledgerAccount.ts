'use server'

import { action } from '@/actions/action'
import { LedgerAccountMethods } from '@/services/ledger/ledgerAccount/methods'

export const createLedgerAccount = action(LedgerAccountMethods.create)
export const readLedgerAccount = action(LedgerAccountMethods.read)
export const calculateLedgerAccountBalance = action(LedgerAccountMethods.calculateBalance)
