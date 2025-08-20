'use server'

import { action } from '@/actions/action'
import { PayoutMethods } from '@/services/ledger/payouts/methods'

export const createPayout = action(PayoutMethods.create)
