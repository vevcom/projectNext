import { apiHandler } from '@/api/apiHandler'
import { UserMethods } from '@/services/users/methods'

export const GET = apiHandler({
    params: (rawparams: { studentCard: string }) => ({
        studentCard: rawparams.studentCard,
    }),
    serviceMethod: UserMethods.readUserWithBalance,
})
