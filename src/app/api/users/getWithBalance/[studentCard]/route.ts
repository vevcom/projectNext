import { apiHandler } from '@/api/apiHandler'
import { readUserWithBalance } from '@/services/users/read'


export const GET = apiHandler({
    params: (rawparams: { studentCard: string }) => ({
        studentCard: rawparams.studentCard,
    }),
    serviceMethod: readUserWithBalance,
})
