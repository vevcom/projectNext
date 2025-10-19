'use server'

import { action } from "../action"
import { StripeCustomerMethods } from "./methods"

export const createStripeCustomerSessionAction = action(StripeCustomerMethods.createSession)
