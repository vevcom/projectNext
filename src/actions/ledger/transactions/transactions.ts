'use server'

import { action } from '@/actions/action'
import { TransactionMethods } from '@/services/ledger/ledgerTransactions/methods'

export const readTransactionsPage = action(TransactionMethods.readPage)
