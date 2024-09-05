'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { readPeriodCountdown } from '@/services/applications/period/read'
import type { ActionReturn } from '@/actions/Types'
import type { CountdownInfo } from '@/services/applications/period/Types'

export async function readPeriodCountdownAction(
    { periodName }: { periodName: string }
): Promise<ActionReturn<CountdownInfo>> {
    return await safeServerCall(() => readPeriodCountdown({ periodName }))
}
