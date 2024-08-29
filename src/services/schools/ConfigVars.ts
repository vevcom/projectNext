import { createSelection } from '@/services/createSelection'
import type { CreateSchoolTypes } from './validation'
import type { School, StandardSchool } from '@prisma/client'

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
] as const satisfies (keyof School)[]

export const SchoolFilteredSelection = createSelection(SchoolFieldsToExpose)
