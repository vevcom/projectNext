import { zpn } from '@/lib/fields/zpn'
import { SEX } from '@prisma/client'
import { z } from 'zod'

export namespace UserSchemas {
    export const studentCardZodValidation = z.string()

    export const fields = z.object({
        username: z.string().max(50).min(2).toLowerCase(),
        sex: z.nativeEnum(SEX).optional().nullable(),
        email: z.string().max(200).min(2).email(),
        emailVerified: z.string().datetime({}).optional().nullable(),
        mobile: z.string().regex(/^\+?\d{4,20}$/, { message: 'Skriv kun tall, uten mellomrom.' }),
        firstname: z.string().max(50).min(2),
        lastname: z.string().max(50).min(2),
        allergies: z.string().max(150).optional().nullable(),
        studentCard: studentCardZodValidation,
        password: z.string().max(50).min(12, {
            // eslint-disable-next-line
            message: 'Passoret må minst ha 12 tegn, en stor og en liten bokstav, et tall, en rune, to emojier, en musikk note, en magisk sopp og en dråpe smørekopp-blod (avsky).'
        }),
        confirmPassword: z.string().max(50).min(12),
        acceptedTerms: zpn.checkboxOrBoolean({
            label: 'Accepted terms',
        }).refine(value => value, 'Du må godta vilkårene for å bruke siden.'),
    })
    const refinePassword = {
        fcn: (data: { password?: string, confirmPassword?: string }) => data.password === data.confirmPassword,
        message: 'Passordene må være like'
    }

    export const create = fields.pick({
        email: true,
        firstname: true,
        lastname: true,
        username: true,
        emailVerified: true,
    })

    export const update = fields.partial().pick({
        email: true,
        firstname: true,
        lastname: true,
        username: true,
    })

    export const register = fields.pick({
        mobile: true,
        allergies: true,
        password: true,
        confirmPassword: true,
        sex: true,
        acceptedTerms: true,
    }).refine(refinePassword.fcn, refinePassword.message)

    export const updatePassword = fields.pick({
        password: true,
        confirmPassword: true,
    }).refine(refinePassword.fcn, refinePassword.message)

    export const registerNewEmail = fields.pick({
        email: true,
    })

    export const connectStudentCard = fields.pick({
        studentCard: true,
    })

    export const verifyEmail = fields.pick({
        email: true,
    })
}
