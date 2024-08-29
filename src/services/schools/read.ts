import 'server-only'
import { School, StandardSchool } from "@prisma/client"
import { prismaCall } from '../prismaCall'
import logger from '@/logger'
import { createStandardSchool } from './create'

export async function readSchoolsPage() {

}

export async function readStandardSchools() : Promise<School[]> {
    return Promise.all(Object.values(StandardSchool).map(async standardSchool => {
        const school = await prismaCall(() => prisma.school.findUnique({
            where: {
                standardSchool,
            }
        }))
        if (!school) {
            logger.warn(`Standard school ${standardSchool} not found in database - creating....`)
            return await createStandardSchool(standardSchool)
        }
        return school
    }))
}

export async function readSchool(name: string) {
    return await prismaCall(() => prisma.school.findUnique({
        where: {
            name: name,
        }
    }))
}