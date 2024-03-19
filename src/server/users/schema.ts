import { SEX } from '@prisma/client'
import { z } from 'zod'
import { Validation } from '../extendZodTypeSchema'

const baseUserValidation = new Validation({
    username: z.string(),
    password: z.string(),
    sex: z.nativeEnum(SEX),
    email: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    confirmPassword: z.string(),
}, {
    username: z.string().max(50).min(2),
    password: z.string().max(50).min(2),
    sex: z.nativeEnum(SEX),
    email: z.string().max(200).min(2).email(),
    firstname: z.string().max(50).min(2),
    lastname: z.string().max(50).min(2),
    confirmPassword: z.string().max(50).min(2),
})

const x = baseUserValidation.typeValidate(new FormData)
if (x.success) {
    x.data.password
}

const y = baseUserValidation.detailedValidate({
    username: 'username',
    password: 'password',
    sex: 'FEMALE',
    email: 'email',
    firstname: 'firstname',
    lastname: 'lastname',
    confirmPassword: 'password',
})

if (y.success) {
    y.data.
}

const derivedUserValidation = baseUserValidation.pick(['username', 'password', 'email'])

const n = derivedUserValidation.typeValidate(new FormData)
if (n.success) {
    n.data.
}