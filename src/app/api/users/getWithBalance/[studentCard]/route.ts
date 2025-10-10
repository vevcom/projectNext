import { apiHandler } from '@/api/apiHandler'
import { userOperations } from '@/services/users/operations'

export const GET = apiHandler({
    params: (rawparams: { studentCard: string }) => ({
        studentCard: rawparams.studentCard,
    }),
    serviceMethod: userOperations.readUserWithBalance,
})
