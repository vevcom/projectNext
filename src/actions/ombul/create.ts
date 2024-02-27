'use server'
import type { Ombul } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import ombulSchema from './schema'
import { v4 as uuid } from 'uuid'
import { join } from 'path'
import { writeFile, mkdir } from 'fs/promises'

/**
 * Create a new Ombul. 
 * @param rawData includes a pdf file with the ombul issue optionaly year and issueNumber 
 * CoverImageId is the id of the Image that will be used as the cover of the ombul
 */
export async function createOmbul(coverImageId: number, rewdata: FormData) : Promise<ActionReturn<Ombul>>  {
    const parse = ombulSchema.safeParse(Object.fromEntries(rewdata.entries()))
    if (!parse.success)  return {
        success: false,
        error: parse.error.issues
    }
    const data = parse.data
    
    const year = data.year || new Date().getFullYear();

    // Get the latest issue number if not provided
    let latestIssueNumber = 1
    if (!data.issueNumber) {
        try {
            const ombul = await prisma.ombul.findFirst({
                where: {
                    year: year
                },
                orderBy: {
                    issueNumber: 'desc'
                }
            })
            if (ombul) {
                latestIssueNumber = ombul.issueNumber + 1
            }
        } catch (error) {
            return errorHandler(error)
        }
    }
    const issueNumber = data.issueNumber || latestIssueNumber
    const name = data.name

    //upload the file to the store volume
    const arrBuffer = await data.ombulFile.arrayBuffer()
    const buffer = Buffer.from(arrBuffer)
    const ext = data.ombulFile.type.split('/')[1]
    if (!['pdf'].includes(ext)) {
        return {
            success: false, 
            error: [
                {
                    path: ['file'],
                    message: 'Invalid file type'
                }
            ]
        }
    }

    const fsLocation = `${uuid()}.${ext}`
    const destination = join('store', 'ombul')
    await mkdir(destination, { recursive: true })
    await writeFile(join(destination, fsLocation), buffer)

    try {
        const ombul = await prisma.ombul.create({
            data: {
                year,
                issueNumber,
                name,
                coverImage: {
                    connect: {
                        id: coverImageId
                    }
                },
                fsLocation: ""
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