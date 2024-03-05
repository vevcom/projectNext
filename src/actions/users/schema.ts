import { z } from 'zod'
import { zfd } from 'zod-form-data'

const userSchema = z.object({
    username: z.string().max(50).min(2),
    password: z.string().max(50).min(2),
    email: z.string().max(200).min(2).email(),
    firstname: z.string().max(50).min(2),
    lastname: z.string().max(50).min(2),
    confirmPassword: z.string().max(50).min(2),
})

export const createUserSchema = zfd.formData(userSchema).refine(
    (data) => data.password === data.confirmPassword,
    'Passord må samsvare med bekreftet passord.'
)

export const updateUserSchema = zfd.formData(userSchema.pick({
    email: true,
    username: true,
    firstname: true,
    lastname: true
}).partial())


export type CreateUserSchemaType = z.infer<typeof createUserSchema>
export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>
