'use server'
import type { Ombul } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import ombulSchema from './schema'

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
    const { year, issueNumber, ombulFile } = parse.data
    
    try {
        
        // find next issue number for the currentYear
        if (!config || !config.issueNumber) {
            const lastOmbul = await prisma.ombul.findFirst({
                where: {
                    issue: {
                        year: currentYear
                    }
                },
                orderBy: {
                    issueNumber: 'desc'
                }
            })
            if (lastOmbul) {
                rewdata.append('issueNumber', (lastOmbul.issue.issueNumber + 1).toString())
            } else {
                rewdata.append('issueNumber', '1')
            }
        }

        const ombul = await prisma.ombul.create({
            data: {
                coverImageId,
                issue: rewdata
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