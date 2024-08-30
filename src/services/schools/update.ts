import 'server-only'
import { UpdateSchoolTypes } from './validation';
import { SchoolFiltered } from './Types';
import { prismaCall } from '../prismaCall';
import { SchoolFilteredSelection } from './ConfigVars';
import { updateApiKeyValidation } from '../api-keys/validation';

export async function updateSchool(id: number, rawdata: UpdateSchoolTypes['Detailed']) : Promise<SchoolFiltered>{
    const data = updateApiKeyValidation.detailedValidate(rawdata)
    
    return await prismaCall(() => prisma.school.update({
        where: { id },
        data,
        select: SchoolFilteredSelection,
    }))
}