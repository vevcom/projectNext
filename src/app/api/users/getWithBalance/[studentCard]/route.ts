import { apiHandler } from '@/api/apiHandler'
import { userMethods } from '@/services/users/methods'

export const GET = apiHandler({
    params: (rawparams: { studentCard: string }) => ({
        studentCard: rawparams.studentCard,
    }),
    serviceMethod: userMethods.readUserWithBalance,
})
