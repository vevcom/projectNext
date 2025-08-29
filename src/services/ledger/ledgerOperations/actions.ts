'use server'

import { action } from "@/actions/action";
import { LedgerOperationMethods } from "./methods";

export const createDepositAction = action(LedgerOperationMethods.createDeposit)
export const createPayout = action(LedgerOperationMethods.createPayout)
