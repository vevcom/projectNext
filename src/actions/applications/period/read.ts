import { safeServerCall } from "@/actions/safeServerCall";
import { ActionReturn } from "@/actions/Types";
import { readPeriodCountdown } from "@/services/applications/period/read";
import { CountdownInfo } from "@/services/applications/period/Types";

export async function readPeriodCountdownAction({ periodName }: { periodName: string }) : Promise<ActionReturn<CountdownInfo>> {
    return await safeServerCall(() => readPeriodCountdown({ periodName }));
}