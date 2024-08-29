import { School, StandardSchool } from "@prisma/client"
import { CreateSchoolTypes } from "./validation"
import { createSelection } from "../createSelection"

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