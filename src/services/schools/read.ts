import 'server-only'
import { createStandardSchool } from './create'
import { SchoolFilteredSelection } from './ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import logger from '@/logger'
import { StandardSchool } from '@prisma/client'
import type { SchoolFiltered } from './Types'
import prisma from '@/prisma'

export async function readSchoolsPage() {

}

export async function readSchools({ onlyNonStandard }: {onlyNonStandard: boolean}): Promise<SchoolFiltered[]> {
    return await prismaCall(() => prisma.school.findMany({
        where: onlyNonStandard ? {
            standardSchool: null,
        } : undefined,
        select: SchoolFilteredSelection,
    }))
}

export async function readStandardSchools(): Promise<SchoolFiltered[]> {
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

export async function readSchool(name: string): Promise<SchoolFiltered> {
    return await prismaCall(() => prisma.school.findUniqueOrThrow({
        where: {
            name,
        },
        select: SchoolFilteredSelection,
    }))
}
