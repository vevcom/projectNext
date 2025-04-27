'use server'

import { action } from '@/actions/action'
import { TransactionMethods } from '@/services/ledger/transactions/methods'

export const readTransactionsPage = action(TransactionMethods.readPage)
