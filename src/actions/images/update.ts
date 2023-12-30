'use server'
import { z } from 'zod'
import type { Image } from '@prisma/client'
import { ActionReturn } from '../type'

export default async function update(imageId: number, rawdata: FormData): Promise<ActionReturn<Image>> {
    const schema = z.object({
        name: z.string().max(50, 'max length in 50').min(2, 'min length is 2'),
        alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2'),
    })
    const parse = schema.safeParse({
        file: rawdata.get('file'),
        name: rawdata.get('name'),
        alt: rawdata.get('alt'),
    })
    if (!parse.success) return { success: false, error: parse.error.issues }
    console.log('ran update')
    const data = parse.data
    return { success: true, error: [], data: undefined }
}