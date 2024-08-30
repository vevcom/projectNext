'use server'
import type { CreateCourseTypes } from '@/services/courses/validation'
import { safeServerCall } from '@/actions/safeServerCall'

export async function createCourseAction(rawdata: FormData | CreateCourseTypes['Type']) {
    console.log('createCourseAction', rawdata)
    return safeServerCall(async () => ({ success: false }))
}
