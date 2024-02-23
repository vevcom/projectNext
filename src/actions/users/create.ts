'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { z } from 'zod'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'
import { parseToFormData } from '../utils'
import { getUser } from '@/auth'

export default async function createUser(rawdata: FormData | User) : Promise<ActionReturn<User>> {
    rawdata = parseToFormData(rawdata);

    //TEST FOR WAIT
    await (new Promise((resolve) => {
        setTimeout(() => {
            resolve('resolved')
        }, 5000)
    }))
    //TEST FOR WAIT

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

export async function registerUser(rawdata: FormData) : Promise<ActionReturn<null>> {
    const { user, status } = await getUser()

    if (!user) {
        return {
            success: false,
            error: [{
                message: status
            }]
        }
    }

    try {

        const parse = z
            .object({
                password: z.string().max(50).min(2),
                confirmPassword: z.string().max(50).min(2),
                acceptTerms: z.literal('on', {
                    errorMap: () => ({ message: "Du må godta vilkårene for å bruk siden." }),
                }),
                sex: z.enum(['FEMALE', 'MALE', 'OTHER']),
            })
            .refine((data) => data.password === data.confirmPassword, 'Password must match confirm password')
            .safeParse({
                password: rawdata.get('password'),
                confirmPassword: rawdata.get('confirmPassword'),
                acceptTerms: rawdata.get('acceptTerms'),
                sex: rawdata.get('sex')
            })
        
        if (!parse.success) {
            return { success: false, error: parse.error.issues }
        }

        const alredyRegistered = await prisma.user.findUnique({
            where: {
                id: user.id
            },
            select: {
                acceptedTerms: true
            }
        })

        if (alredyRegistered?.acceptedTerms !== null) {
            return {
                success: false,
                error: [{
                    message: 'User already registered'
                }]
            }
        }

        const results = await prisma.$transaction([
            prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    acceptedTerms: new Date(),
                    sex: parse.data.sex
                }
            }),
            prisma.credentials.create({
                data: {
                    passwordHash: parse.data.password,
                    userId: user.id,
                    username: user.username,
                }
            })
        ])

        return {success: true, data: null};

    } catch (error) {
        return errorHandler(error)
    }
}