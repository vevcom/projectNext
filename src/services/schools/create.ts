import 'server-only'
import { createSchoolValidation } from './validation'
import { SchoolFilteredSelection, StandardSchoolsConfig } from './ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { createCmsImage } from '@/services/cms/images/create'
import { createCmsParagraph } from '@/services/cms/paragraphs/create'
import { v4 as uuid } from 'uuid'
import { StandardSchool } from '@prisma/client'
import type { SchoolFiltered } from './Types'
import type { CreateSchoolTypes } from './validation'
import prisma from '@/prisma'

export async function createSchool(rawdata: CreateSchoolTypes['Detailed']): Promise<SchoolFiltered> {
    const data = createSchoolValidation.detailedValidate(rawdata)

    const cmsImage = await createCmsImage({ name: uuid() })
    const cmsParagraph = await createCmsParagraph({ name: uuid() })

    return await prismaCall(() => prisma.school.create({
        data: {
            name: data.name,
            shortname: data.shortname,
            standardSchool: data.standardSchool,
            cmsImage: {
                connect: {
                    id: cmsImage.id
                }
            },
            cmsParagraph: {
                connect: {
                    id: cmsParagraph.id
                }
            },
        },
        select: SchoolFilteredSelection
    }))
}

export async function createStandardSchool(standardSchool: StandardSchool): Promise<SchoolFiltered> {
    if (!Object.values(StandardSchool).includes(standardSchool)) {
        throw new ServerError('BAD PARAMETERS', 'Invalid standard school')
    }
    return await createSchool({
        ...StandardSchoolsConfig[standardSchool],
        standardSchool,
    })
}
