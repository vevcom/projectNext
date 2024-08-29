import 'server-only'
import { School, StandardSchool } from "@prisma/client";
import { prismaCall } from "../prismaCall";
import { CreateSchoolTypes, createSchoolValidation } from "./validation";
import { ServerError } from "../error";
import { SchoolFilteredSelection, StandardSchoolsConfig } from "./ConfigVars";
import { createCmsImage } from '../cms/images/create';
import { v4 as uuid } from 'uuid'
import { createCmsParagraph } from '../cms/paragraphs/create';
import { SchoolFiltered } from './Types';

export async function createSchool(rawdata: CreateSchoolTypes['Detailed']) : Promise<SchoolFiltered> {
    const data = createSchoolValidation.detailedValidate(rawdata)

    const cmsImage = await createCmsImage({ name: uuid() })
    const cmsParagraph = await createCmsParagraph({ name: uuid() })

    return await prismaCall(() => prisma.school.create({
        data: {
            name: data.name,
            shortname: data.shortname,
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

export async function createStandardSchool(standardSchool: StandardSchool) : Promise<SchoolFiltered> {
    if (!Object.values(StandardSchool).includes(standardSchool)) {
        throw new ServerError('BAD PARAMETERS', 'Invalid standard school')
    }
    return await createSchool({
        ...StandardSchoolsConfig[standardSchool],
        standardSchool: standardSchool,
    })
}