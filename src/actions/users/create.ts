'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'

const userSchema = zfd.formData({
    username: z.string().max(50).min(2),
    password: z.string().max(50).min(2),
    email: z.string().max(200).min(2).email(),
    firstname: z.string().max(50).min(2),
    lastname: z.string().max(50).min(2),
    confirmPassword: z.string().max(50).min(2),
}).refine((data) => data.password === data.confirmPassword, 'Password must match confirm password')

type createUserArgs = z.infer<typeof userSchema>

export async function createUser(rawdata: FormData | createUserArgs): Promise<ActionReturn<User>> {
    const parse = userSchema.safeParse(rawdata)

    if (!parse.success) {
        return { success: false, error: parse.error.issues }
    }

    const { username, password, email, firstname, lastname } = parse.data

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                firstname,
                lastname,
                credentials: {
                    create: {
                        passwordHash: password, // TEMPORARY!
                    },
                },
            },
        })

        return { success: true, data: user }
    } catch (error) {
        return errorHandler(error)
    }
}