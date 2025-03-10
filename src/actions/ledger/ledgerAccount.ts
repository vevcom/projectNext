"use server"

import { action } from "@/actions/action";
import { LedgerAccount } from "@/services/ledger/ledgerAccount/methods";

export const createLedgerAccount = action(LedgerAccount.create)
export const readLedgerAccount = action(LedgerAccount.read)
export const calculateLedgerAccountBalance = action(LedgerAccount.calculateBalance)