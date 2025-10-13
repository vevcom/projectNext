import '@pn-server-only'
import { apiHandler } from '@/api/apiHandler'
import { userOperations } from '@/services/users/operations'

export const POST = apiHandler({
    serviceOperation: userOperations.create
})
