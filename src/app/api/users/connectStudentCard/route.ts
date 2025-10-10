import { apiHandler } from '@/api/apiHandler'
import { userOperations } from '@/services/users/operations'


export const POST = apiHandler({
    serviceMethod: userOperations.connectStudentCard
})
