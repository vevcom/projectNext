import 'server-only'
import { School, StandardSchool } from "@prisma/client";
import { prismaCall } from "../prismaCall";
import { CreateSchoolTypes, createSchoolValidation } from "./validation";
import { ServerError } from "../error";
import { StandardSchoolsConfig } from "./ConfigVars";


export async function createSchool(rawdata: CreateSchoolTypes['Detailed']) : Promise<School> {
    const data = createSchoolValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.school.create({
        data: {
            name: data.name,
            shortname: data.shortname,
        }
    }))
}

export async function createStandardSchool(standardSchool: StandardSchool) : Promise<School> {
    if (!Object.values(StandardSchool).includes(standardSchool)) {
        throw new ServerError('BAD PARAMETERS', 'Invalid standard school')
    }
    return await createSchool(StandardSchoolsConfig[standardSchool])
}