'use server'

import { safeServerCall } from '@/services/actionError'
import type { z } from 'zod'
import type { courseSchemas } from './schemas'
import logger from '@/lib/logger'

// NOTE: still a stub — course creation is not implemented yet. Once it is, translate this into a
// defineOperation (operations.ts) + makeAction here, the way the other education services are built.
export async function createCourseAction(rawdata: FormData | z.input<typeof courseSchemas.create>) {
    logger.debug(`Unused data: ${rawdata}`)
    return safeServerCall(async () => ({ success: false }))
}
