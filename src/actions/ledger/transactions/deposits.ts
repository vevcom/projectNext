"use server"

import { action } from "@/actions/action";
import { Deposits } from "@/services/ledger/transactions/deposits/methods";

export const createDeposit = action(Deposits.create)