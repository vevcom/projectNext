'use server'

import { stripeCustomerOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const createStripeCustomerSessionAction = makeAction(stripeCustomerOperations.createSession)
