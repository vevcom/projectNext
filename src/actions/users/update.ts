'use server'
import type { User } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'
import { requireUser } from '@/auth'
import { z } from 'zod'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'

export async function registerOwnUser(rawdata: FormData) : Promise<ActionReturn<User>> {
    const user = await requireUser({
        redirectUrl: '/login'
    });

    if (!user) {
        return {
            success: false,
            error: [{
                message: '403: Not authenticated'
            }]
        }
    }

    const parse = z.object({
        yearOfStudy: z.coerce.number().int().min(1, 'Det laveste gyldige trinnet er 1.').max(5, 'Det høyeste gyldige trinnet er 5.'),
        password: z.string().min(8, 'Passordet må være minst 8 tegn langt.'),
        acceptedTerms: z.enum(['on'], {
            errorMap: (issue, ctx) => ({ message: 'For å opprette bruker må du godta vilkårene' })
        }),
    }).safeParse({
        yearOfStudy: rawdata.get('yearOfStudy'),
        password: rawdata.get('password'),
        acceptedTerms: rawdata.get('acceptedTerms')
    })

    if (!parse.success) {
        return {
            success: false,
            error: parse.error.issues
        }
    }

    try {
        const results = await prisma.$transaction(async (p) => {
            const updatedUser = await p.user.update({
                where: {
                    id: user.id
                },
                data: {
                    yearOfStudy: parse.data.yearOfStudy,
                    password: parse.data.password,
                }
            })

            if (updatedUser.studyProgramId) {
                const rolesReturn = await p.studyProgramRole.findMany({
                    where: {
                        studyProgramId: {
                            equals: updatedUser.studyProgramId
                        }
                    }
                })

                await p.rolesUsers.createMany({
                    data: rolesReturn.map(role => {
                        return {
                            userId: updatedUser.id,
                            roleId: role.roleId
                        }
                    })
                })
            }

            return updatedUser;
        })

        return { success: true, data: results }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function linkUserToStudyProgram(userId: number, studyProgramId: number) : Promise<ActionReturn<User>> {
    try {
        const results = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                studyProgram: {
                    connect: {
                        id: studyProgramId,
                    }
                }
            }
        })

        return { success: true, data: results }
    } catch (error) {
        return errorHandler(error)
    }
}