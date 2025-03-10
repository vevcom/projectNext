"use server"

import { action } from "@/actions/action";
import { Payouts } from "@/services/ledger/transactions/payouts/methods";

export const createPayout = action(Payouts.create)