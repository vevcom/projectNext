'use server'

import { action } from '@/services/action'
import { authOperations } from '@/services/auth/operations'

export const verifyResetPasswordTokenAction = action(authOperations.verifyResetPasswordToken)
export const resetPasswordAction = action(authOperations.resetPassword)
export const sendResetPasswordEmailAction = action(authOperations.sendResetPasswordEmail)
export const verifyEmailAction = action(authOperations.verifyEmail)
