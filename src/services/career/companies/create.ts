import 'server-only'
import { createCompanyValidation } from './validation'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { createCmsImage } from '@/services/cms/images/create'
import { v4 as uuid } from 'uuid'

export const create = ServiceMethodHandler({
    withData: true,
    validation: createCompanyValidation,
    handler: async (prisma, _, data) => {
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
