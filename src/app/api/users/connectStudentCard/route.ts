import { apiHandler } from '@/api/apiHandler'
import { UserMethods } from '@/services/users/methods'


export const POST = apiHandler({
    serviceMethod: UserMethods.connectStudentCard
})
