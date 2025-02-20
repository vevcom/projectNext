'use server'

import { apiHandler } from '@/api/apiHandler'
import { connectStudentCard } from '@/services/users/update'


export const POST = apiHandler({
    serviceMethod: connectStudentCard,
})
