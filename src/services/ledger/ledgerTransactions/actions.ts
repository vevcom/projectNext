import { action } from '@/services/action';
import { LedgerTransactionMethods } from './methods';

export const readLedgerTransactionPageAction = action(LedgerTransactionMethods.readPage)
