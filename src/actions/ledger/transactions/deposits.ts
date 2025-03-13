"use server"

import { action } from "@/actions/action";
import { DepositMethods } from "@/services/ledger/transactions/deposits/methods";

export const createStripeDeposit = action(DepositMethods.createStripe)