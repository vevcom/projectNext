'use server'

import prisma from '@/prisma'
import { z } from 'zod'
import errorHandeler from '@/prisma/errorHandler'
import type { ActionReturn } from '@/actions/type'

export default async function create(rawdata: FormData) : Promise<ActionReturn> {
    console.log('create')
    await(new Promise ((resolve, reject) => {
        setTimeout(() => {
            resolve('resolved')
        }, 5000)
    }))
    const schema = z.object({
        username: z.string().max(50).min(2),
        password: z.string().max(50).min(2),
        email: z.string().max(200).min(2).email(),
        firstname: z.string().max(50).min(2),
        lastname: z.string().max(50).min(2),
        confirmPassword: z.string().max(50).min(2),
    }).refine((data) => data.password === data.confirmPassword, 'Password must match confirm password')
    const parse = schema.safeParse({
        username: rawdata.get('username'),
        password: rawdata.get('password'),
        email: rawdata.get('email'),
        firstname: rawdata.get('firstname'),
        lastname: rawdata.get('lastname'),
        confirmPassword: rawdata.get('confirmPassword'),
    })
    if (!parse.success) {
        return { success: false, error: parse.error.message }
    }

    const { username, password, email, firstname, lastname } = parse.data

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password,
                firstname,
                lastname,
            }
        })

        return { success: true, data: user }
    } catch (error) {
        return errorHandeler(error)
    }
}
