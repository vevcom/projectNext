'use server'

import { ActionReturn } from '@/actions/type'
import errorHandeler from '@/prisma/errorHandler';
import { z } from 'zod'

export async function readRoles() {
    return await prisma.role.findMany();
}

export async function createRole(data: FormData) : Promise<ActionReturn<void>> {
    const schema = z.object({ name: z.string() })

    const parse = schema.safeParse({
        name: data.get('name')
    })

    if (!parse.success) return { success: false, error: parse.error.issues }


    const { name } = parse.data

    if(!name) return { success: false } 
    
    try {
        await prisma.role.create({data: {name}})
    } catch(e) {
        return errorHandeler(e)
    }

    return { success: true }
}

export async function destroyRole(roleId: number) : Promise<ActionReturn<never>> {
    try {
        await prisma.role.delete({
            where: {
                id: roleId
            }
        })
    } catch(e) {
        return errorHandeler(e)
    }

    return { success: true }
}