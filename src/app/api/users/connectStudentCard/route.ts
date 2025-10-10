import { apiHandler } from '@/api/apiHandler'
import { userMethods } from '@/services/users/methods'


export const POST = apiHandler({
    serviceMethod: userMethods.connectStudentCard
})
