import 'server-only'
import { School, StandardSchool } from "@prisma/client"
import { prismaCall } from '../prismaCall'
import logger from '@/logger'
import { createStandardSchool } from './create'
import { SchoolFiltered } from './Types'
import { SchoolFilteredSelection } from './ConfigVars'

export async function readSchoolsPage() {

}

export async function readSchools() : Promise<SchoolFiltered[]> {
    return await prismaCall(() => prisma.school.findMany({
        select: SchoolFilteredSelection,
    }))
}

export async function readStandardSchools() : Promise<SchoolFiltered[]> {
    return Promise.all(Object.values(StandardSchool).map(async standardSchool => {
        const school = await prismaCall(() => prisma.school.findUnique({
            where: {
                standardSchool,
            },
            select: SchoolFilteredSelection,
        }))
        if (!school) {
            logger.warn(`Standard school ${standardSchool} not found in database - creating....`)
            return await createStandardSchool(standardSchool)
        }
        return school
    }))
}

export async function readSchool(name: string) : Promise<SchoolFiltered> {
    return await prismaCall(() => prisma.school.findUniqueOrThrow({
        where: {
            name,
        },
        select: SchoolFilteredSelection,
    }))
}