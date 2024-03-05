import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const userSchema = zfd.formData({
    username: z.string().max(50).min(2),
    password: z.string().max(50).min(2),
    email: z.string().max(200).min(2).email(),
    firstname: z.string().max(50).min(2),
    lastname: z.string().max(50).min(2),
    confirmPassword: z.string().max(50).min(2),
}).refine((data) => data.password === data.confirmPassword, 'Password must match confirm password')