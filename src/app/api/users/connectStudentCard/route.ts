'use server'

import { apiHandler } from '@/api/apiHandler'
import { User } from '@/services/users'


export const POST = apiHandler({
    serviceMethod: User.connectStudentCard,
    params: () => ({}),
})
