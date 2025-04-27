'use server'

import { action } from '@/actions/action'
import { PayoutMethods } from '@/services/ledger/transactions/payouts/methods'

export const createPayout = action(PayoutMethods.create)
