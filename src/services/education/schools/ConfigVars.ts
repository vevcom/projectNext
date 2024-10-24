import { createSelection } from '@/services/createSelection'
import { CmsLinkRelationsIncluder } from '@/services/cms/links/ConfigVars'
import type { CreateSchoolTypes } from './validation'
import type { Prisma, School, StandardSchool } from '@prisma/client'

export const StandardSchoolsConfig = {
    NTNU: {
        name: 'Norges tekniske og naturvitenskapelige universitet',
        shortname: 'NTNU',
    }
} as const satisfies Record<StandardSchool, CreateSchoolTypes['Detailed']>

export const SchoolFieldsToExpose = [
    'name',
    'shortname',
    'id',
    'desctiption',
] as const satisfies (keyof School)[]

export const SchoolFilteredSelection = createSelection(SchoolFieldsToExpose)

export const SchoolRelationIncluder = {
    cmsImage: {
        include: {
            image: true,
        }
    },
    cmsParagraph: true,
    cmsLink: {
        include: CmsLinkRelationsIncluder,
    },
} satisfies Prisma.SchoolInclude
