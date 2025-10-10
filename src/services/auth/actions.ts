'use server'

import { action } from '@/services/action'
import { authMethods } from '@/services/auth/methods'

export const verifyResetPasswordTokenAction = action(authMethods.verifyResetPasswordToken)
export const resetPasswordAction = action(authMethods.resetPassword)
export const sendResetPasswordEmailAction = action(authMethods.sendResetPasswordEmail)
export const verifyEmailAction = action(authMethods.verifyEmail)
