'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { Image } from '@prisma/client'
import type { ActionReturn, ReadPageInput } from '@/actions/type'
import { UserFiltered, userFieldsToExpose, UserDetails } from './Types'

export async function readUserPage<const PageSize extends number>({ 
    page, 
    details 
}: ReadPageInput<PageSize, UserDetails>): Promise<ActionReturn<UserFiltered[]>> {
    const words = details.partOfName.split(' ');
    try {
        const users = await prisma.user.findMany({
            skip: page.page * page.pageSize,
            take: page.pageSize,
            select: userFieldsToExpose.reduce((prev, field) => ({ 
                ...prev, 
                [field]: true
            }), {} as { [key in typeof userFieldsToExpose[number]]: true }),
            where: {
                OR: words.map(word => ({
                    OR: [
                        { firstname: { contains: word } },
                        { lastname: { contains: word } },
                        { username: { contains: word } },
                    ],
                }))
                //TODO select on groups
            }
        })
        return { success: true, data: users }
    } catch (error) {
        return errorHandler(error)
    }
}