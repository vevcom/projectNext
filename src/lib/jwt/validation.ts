import '@pn-server-only'

import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

export const baseJWTValidation = new ValidationBase({
    type: {
        iss: z.string(),
        aud: z.string(),
        sub: z.string().or(z.number()),
        iat: z.number(),
        exp: z.number(),
    },
    details: {
        iss: z.string(),
        aud: z.string(),
        sub: z.string().or(z.number()),
        iat: z.number(),
        exp: z.number(),
    }
})

export const jwtPayloadValidation = baseJWTValidation.createValidation({
    keys: [
        'iss',
        'aud',
        'sub',
        'iat',
        'exp',
    ],
    transformer: data => data,
})
export type JwtPayloadType = ValidationTypes<typeof jwtPayloadValidation>
