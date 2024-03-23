import { ValidationBase } from '@/server/Validation'
import { SEX } from '@prisma/client'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

const baseUserValidation = new ValidationBase({
    type: {
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
    },
    details: {
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
    }
})

const refiner = {
    fcn: (data: { password: string, confirmPassword: string }) => data.password === data.confirmPassword,
    message: 'Passordene må være like'
}

export const createUserValidation = baseUserValidation.createValidation({
    keys: [
        'confirmPassword',
        'email',
        'firstname',
        'sex',
        'username',
        'lastname',
        'password',
    ],
    transformer: data => data,
    refiner,
})
export type CreateUserTypes = ValidationTypes<typeof createUserValidation>

export const updateUserValidation = baseUserValidation.createValidation({
    keys: [
        'email',
        'username',
        'firstname',
        'lastname',
    ],
    transformer: data => data,
})
export type UpdateUserTypes = ValidationTypes<typeof updateUserValidation>

export const registerUserValidation = baseUserValidation.createValidation({
    keys: [
        'email',
        'password',
        'confirmPassword',
        'sex',
    ],
    transformer: data => data,
    refiner,
})

export type RegisterUserTypes = ValidationTypes<typeof registerUserValidation>
