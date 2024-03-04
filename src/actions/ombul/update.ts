'use server'
import { ombulUpdateSchema, ombulUpdateFileSchema } from "./schema"
import type { ActionReturn } from "@/actions/Types"
import type { ExpandedOmbul } from "./Types"
import { getUser } from "@/auth"
import prisma from "@/prisma"
import errorHandler from "@/prisma/errorHandler"
import createFile from "@/store/createFile"
import deleteFile from "@/store/deleteFile"

/**
 * Update an ombul
 * @param id - The id of the ombul to update
 * @param rawdata - The new data for the ombul including: name, year, issueNumber, description,
 * @returns The updated ombul
 */
export async function updateOmbul(id: number, rawdata: FormData): Promise<ActionReturn<ExpandedOmbul>> {
    // auth route
    const { user, status } = await getUser({
        permissions: ['OMBUL_UPDATE']
    })
    if (!user) {
        return {
            success: false,
            error: [{
                message: status
            }]
        }
    }
    
    const parse = ombulUpdateSchema.safeParse(Object.fromEntries(rawdata.entries()))
    if (!parse.success) return {
        success: false,
        error: parse.error.issues
    }
    const data = parse.data

    try {
        const ombul = await prisma.ombul.update({
            where: {
                id
            },
            data,
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
        return {
            success: true,
            data: ombul
        }
    } catch (error) {
        return errorHandler(error)
    }
}

/**
 * Update the ombul file (i.e. the pdf file) of an ombul
 * @param id - The id of the ombul to update
 * @param rawData - The new data for the new ombul file with field name 'file'
 * @returns The updated ombul
 */
export async function updateOmbulFile(id: number, rawData: FormData): Promise<ActionReturn<ExpandedOmbul>> {
    // auth route
    const { user, status } = await getUser({
        permissions: ['OMBUL_UPDATE']
    })
    if (!user) {
        return {
            success: false,
            error: [{
                message: status
            }]
        }
    }

    const parse = ombulUpdateFileSchema.safeParse({
        file: rawData.get('file'),
    })
    if (!parse.success) return {
        success: false,
        error: parse.error.issues
    }
    const data = parse.data

    const ret = await createFile(data.ombulFile, 'ombul', ['pdf']);
    if (!ret.success) return ret
    const fsLocation = ret.data.fsLocation

    const ombul = await prisma.ombul.findUnique({
        where: {
            id
        }
    })
    if (!ombul) return {
        success: false,
        error: [{
            message: 'Ombul ikke funnet'
        }]
    }

    const oldFsLocation = ombul.fsLocation

    try {
        const ombul = await prisma.ombul.update({
            where: {
                id
            },
            data: {
                fsLocation
            },
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })

        //delete the old file
        await deleteFile('ombul', oldFsLocation)


        return {
            success: true,
            data: ombul
        }
    } catch (error) {
        return errorHandler(error)
    }
}