"use server"

import { action } from "@/actions/action"
import { PaymentMethods } from "@/services/ledger/transactions/payment/methods"

export const createPayment = action(PaymentMethods.create)