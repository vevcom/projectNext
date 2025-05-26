'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { readPeriodCountdown } from '@/services/applications/periods/read'
import type { ActionReturn } from '@/actions/Types'
import type { CountdownInfo } from '@/services/applications/periods/Types'
import { action } from '@/actions/action'
import { ApplicationPeriodMethods } from '@/services/applications/periods/methods'

export async function readPeriodCountdownAction(
    { periodName }: { periodName: string }
): Promise<ActionReturn<CountdownInfo>> {
    return await safeServerCall(() => readPeriodCountdown({ periodName }))
}

export const readApplicationPeriodsAction = action(ApplicationPeriodMethods.readAll)
