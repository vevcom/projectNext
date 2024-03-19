import { SEX } from '@prisma/client'
import { z } from 'zod'
import { Validation } from '../Validation'
import type { ValidationType } from '../Validation'

const baseUserValidation = new Validation({
    username: z.string(),
    password: z.string(),
    sex: z.nativeEnum(SEX),
    email: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    confirmPassword: z.string(),
    acceptedTerms: z.literal('on', {
        errorMap: () => ({ message: 'Du må godta vilkårene for å bruk siden.' }),
    }),
}, {
    username: z.string().max(50).min(2),
    password: z.string().max(50).min(2),
    sex: z.nativeEnum(SEX),
    email: z.string().max(200).min(2).email(),
    firstname: z.string().max(50).min(2),
    lastname: z.string().max(50).min(2),
    confirmPassword: z.string().max(50).min(2),
    acceptedTerms: z.literal('on', {
        errorMap: () => ({ message: 'Du må godta vilkårene for å bruk siden.' }),
    }),
})

export const createUserValidation = baseUserValidation.pick([
    'confirmPassword',
    'email',
    'firstname',
    'sex',
    'username', 
    'lastname',
    'password',
]).setRefiner(data => data.password === data.confirmPassword, 'Passordene må være like')
export type CreateUserType = ValidationType<typeof createUserValidation>

export const updateUserValidation = baseUserValidation.pick([
    'email',
    'username',
    'firstname',
    'lastname',
]).partialize()
export type UpdateUserType = ValidationType<typeof updateUserValidation>

export const registerUserValidation = baseUserValidation.pick([
    'email',
    'password',
    'confirmPassword',
    'sex',
    'username'
]).setRefiner(data => data.password === data.confirmPassword, 'Passordene må være like')
export type RegisterUserType = ValidationType<typeof registerUserValidation>