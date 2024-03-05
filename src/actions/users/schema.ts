import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const createUserSchema = zfd.formData({
    username: z.string().max(50).min(2),
    password: z.string().max(50).min(2),
    email: z.string().max(200).min(2).email(),
    firstname: z.string().max(50).min(2),
    lastname: z.string().max(50).min(2),
    confirmPassword: z.string().max(50).min(2),
}).refine((data) => data.password === data.confirmPassword, 'Password must match confirm password')

export const updateUserSchema = zfd.formData({
    username: z.string().max(50).min(2),
    email: z.string().max(200).min(2).email(),
    firstname: z.string().max(50).min(2),
    lastname: z.string().max(50).min(2),
})

export type CreateUserSchemaType = z.infer<typeof createUserSchema>
export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>
