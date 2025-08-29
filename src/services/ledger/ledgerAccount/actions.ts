"use server"

import { action } from "@/actions/action"
import { LedgerAccountMethods } from "./methods"

export const calculateLedgerAccountBalanceAction = action(LedgerAccountMethods.calculateBalance)
