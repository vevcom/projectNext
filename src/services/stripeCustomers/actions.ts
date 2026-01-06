'use server'

import { makeAction } from "@/services/serverAction"
import { StripeCustomerMethods } from "./operations"

export const createStripeCustomerSessionAction = makeAction(StripeCustomerMethods.createSession)
