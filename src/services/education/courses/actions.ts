'use server'

import { safeServerCall } from '@/actions/safeServerCall'
import type { CreateCourseTypes } from '@/education/courses/validation'

export async function createCourseAction(rawdata: FormData | CreateCourseTypes['Type']) {
    console.log('createCourseAction', rawdata)
    return safeServerCall(async () => ({ success: false }))
}
