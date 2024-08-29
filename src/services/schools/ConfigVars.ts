import { StandardSchool } from "@prisma/client";
import { CreateSchoolTypes } from "./validation";

export const StandardSchoolsConfig = {
    NTNU: {
        name: 'Norges tekniske og naturvitenskapelige universitet',
        shortName: 'NTNU',
    }
} as const satisfies Record<StandardSchool, CreateSchoolTypes['Detailed']>