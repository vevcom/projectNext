import 'server-only'
import { createCompanyValidation } from './validation'
import { createCompanyAuther } from './authers'
import { createCmsImage } from '@/services/cms/images/create'
import { ServiceMethod } from '@/services/ServiceMethod'
import { v4 as uuid } from 'uuid'

export const createCompany = ServiceMethod({
    dataValidation: createCompanyValidation,
    auther: createCompanyAuther,
    dynamicAuthFields: () => ({}),
    method: async ({ prisma, data }) => {
        //TODO: tranaction when createCmsImage is service method.
        const logo = await createCmsImage({ name: uuid() })
        return await prisma.company.create({
            data: {
                ...data,
                logoId: logo.id,
            }
        })
    }
})
