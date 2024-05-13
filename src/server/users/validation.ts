import { ValidationBase } from '@/server/Validation'
import { SEX } from '@prisma/client'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

const baseUserValidation = new ValidationBase({
    type: {
        username: z.string(),
        sex: z.nativeEnum(SEX).optional().nullable(),
        email: z.string(),
        emailVerified: z.string().optional().nullable(),
        mobile: z.string(),
        firstname: z.string(),
        lastname: z.string(),
        allergies: z.string().optional().nullable(),
        password: z.string().optional(),
        confirmPassword: z.string().optional(),
        acceptedTerms: z.literal('on', {
            errorMap: () => ({ message: 'Du må godta vilkårene for å bruk siden.' }),
        }),
    },
    details: {
        username: z.string().max(50).min(2),
        sex: z.nativeEnum(SEX).optional().nullable(),
        email: z.string().max(200).min(2).email(),
        emailVerified: z.string().datetime({}).optional().nullable(),
        mobile: z.string().regex(/^\+?\d{4,20}$/, { message: 'Skriv kun tall, uten mellomrom.' }),
        firstname: z.string().max(50).min(2),
        lastname: z.string().max(50).min(2),
        allergies: z.string().max(150).optional().nullable(),
        password: z.string().max(50).min(2).optional(),
        confirmPassword: z.string().max(50).min(2).optional(),
        acceptedTerms: z.literal('on', {
            errorMap: () => ({ message: 'Du må godta vilkårene for å bruk siden.' }),
        }),
    }
})

const refiner = {
    fcn: (data: { password?: string, confirmPassword?: string }) => data.password === data.confirmPassword,
    message: 'Passordene må være like'
}

export const createUserValidation = baseUserValidation.createValidation({
    keys: [
        'confirmPassword',
        'email',
        'emailVerified',
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

export const updateUserValidation = baseUserValidation.createValidationPartial({
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
        'mobile',
        'allergies',
        'password',
        'confirmPassword',
        'sex',
        'acceptedTerms',
    ],
    transformer: data => data,
    refiner,
})

export type RegisterUserTypes = ValidationTypes<typeof registerUserValidation>

export const updateUserPasswordValidation = baseUserValidation.createValidation({
    keys: [
        'password',
        'confirmPassword',
    ],
    transformer: data => data,
    refiner,
})

export type UpdateUserPasswordTypes = ValidationTypes<typeof updateUserPasswordValidation>
