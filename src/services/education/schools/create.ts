import '@pn-server-only'
import { createSchoolValidation } from './validation'
import { SchoolFilteredSelection, StandardSchoolsConfig } from './ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { prisma } from '@/prisma/client'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { cmsImageOperations } from '@/cms/images/operations'
import { v4 as uuid } from 'uuid'
import { StandardSchool } from '@prisma/client'
import type { SchoolFiltered } from './types'
import type { CreateSchoolTypes } from './validation'
import { createCmsLink } from '@/services/cms/links/create'

export async function createSchool(rawdata: CreateSchoolTypes['Detailed']): Promise<SchoolFiltered> {
    const data = createSchoolValidation.detailedValidate(rawdata)

    const cmsImage = await cmsImageOperations.create({
        data: {},
        bypassAuth: true
    })
    const cmsParagraph = await cmsParagraphOperations.create({
        data: {},
        bypassAuth: true
    })
    const cmsLink = await createCmsLink({ name: uuid() })

    return await prismaCall(() => prisma.school.create({
        data: {
            name: data.name,
            shortName: data.shortName,
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
            cmsLink: {
                connect: {
                    id: cmsLink.id
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
