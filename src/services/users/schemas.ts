import { Zpn } from '@/lib/fields/zpn'
import { SEX, RelationshipStatus } from '@prisma/client'
import { z } from 'zod'

export const studentCardSchema = z.string()

export const userSchema = z.object({
    username: z.string().max(50).min(2).toLowerCase(),
    sex: z.nativeEnum(SEX).optional().nullable(),
    email: z.string().max(200).min(2).email(),
    emailVerified: z.string().datetime({}).optional().nullable(),
    mobile: z.string().regex(/^\+?\d{4,20}$/, { message: 'Skriv kun tall, uten mellomrom.' }),
    firstname: z.string().max(50).min(2),
    lastname: z.string().max(50).min(2),
    allergies: z.string().max(150).optional().nullable(),
    bio: z.string().max(2047).optional(),
    relationshipstatusText: z.string().max(150).optional(),
    relationshipStatus: z.nativeEnum(RelationshipStatus).optional(),
    studentCard: studentCardSchema,
    password: z.string().max(50).min(12, {
        // eslint-disable-next-line
        message: 'Passoret må minst ha 12 tegn, en stor og en liten bokstav, et tall, en rune, to emojier, en musikk note, en magisk sopp og en dråpe smørekopp-blod (avsky).'
    }),
    confirmPassword: z.string().max(50).min(12),
    imageConsent: Zpn.checkboxOrBoolean({
        label: 'Accepted images'
    }).optional(),
    acceptedTerms: Zpn.checkboxOrBoolean({
        label: 'Accepted terms',
    }).refine(value => value, 'Du må godta vilkårene for å bruke siden.'),
})
const refinePassword = {
    fcn: (data: { password?: string, confirmPassword?: string }) => data.password === data.confirmPassword,
    message: 'Passordene må være like'
}

export const userSchemas = {
    create: userSchema.pick({
        email: true,
        firstname: true,
        lastname: true,
        username: true,
        emailVerified: true,
    }),

    update: userSchema.partial().pick({
        email: true,
        firstname: true,
        lastname: true,
        username: true,
        mobile: true,
        allergies: true,
        sex: true,
        bio: true,
        imageConsent: true,
        relationshipstatusText: true,
        relationshipStatus: true,
    }),

    updateProfile: userSchema.partial().pick({
        allergies: true,
        sex: true,
        bio: true,
        imageConsent: true,
        relationshipstatusText: true,
        relationshipStatus: true,
    }),

    register: userSchema.pick({
        mobile: true,
        allergies: true,
        password: true,
        confirmPassword: true,
        sex: true,
        imageConsent: true,
        acceptedTerms: true,
    }).refine(refinePassword.fcn, refinePassword.message),

    updatePassword: userSchema.pick({
        password: true,
        confirmPassword: true,
    }).refine(refinePassword.fcn, refinePassword.message),

    registerNewEmail: userSchema.pick({
        email: true,
    }),

    connectStudentCard: userSchema.pick({
        studentCard: true,
    }),

    verifyEmail: userSchema.pick({
        email: true,
    }),
}
