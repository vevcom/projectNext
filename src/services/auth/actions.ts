'use server'

import { action } from '@/actions/action'
import { AuthMethods } from '@/services/auth/methods'

export const verifyResetPasswordTokenAction = action(AuthMethods.verifyResetPasswordToken)
export const resetPasswordAction = action(AuthMethods.resetPassword)
export const sendResetPasswordEmailAction = action(AuthMethods.sendResetPasswordEmail)
export const verifyEmailAction = action(AuthMethods.verifyEmail)
