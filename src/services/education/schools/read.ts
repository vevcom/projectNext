import '@pn-server-only'
import { createStandardSchool } from './create'
import { SchoolFilteredSelection, SchoolRelationIncluder } from './ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import logger from '@/lib/logger'
import prisma from '@/prisma'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { StandardSchool } from '@prisma/client'
import type { ExpandedSchool, SchoolCursor, SchoolFiltered } from './Types'
import type { ReadPageInput } from '@/lib/paging/Types'

export async function readSchoolsPage<const PageSize extends number>({
    page,
}: ReadPageInput<PageSize, SchoolCursor>): Promise<ExpandedSchool[]> {
    return await prismaCall(() => prisma.school.findMany({
        select: {
            ...SchoolFilteredSelection,
            ...SchoolRelationIncluder,
        },
        orderBy: [
            { standardSchool: 'asc' },
            { shortname: 'asc' },
            { id: 'asc' },
        ],
        ...cursorPageingSelection(page),
    }))
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

export async function readSchool(shortname: string): Promise<ExpandedSchool> {
    return await prismaCall(() => prisma.school.findUniqueOrThrow({
        where: {
            shortname,
        },
        select: {
            ...SchoolFilteredSelection,
            ...SchoolRelationIncluder,
        },
    }))
}
