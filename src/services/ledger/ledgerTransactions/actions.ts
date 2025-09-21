import { LedgerTransactionMethods } from './methods'
import { action } from '@/services/action'

export const readLedgerTransactionPageAction = action(LedgerTransactionMethods.readPage)
