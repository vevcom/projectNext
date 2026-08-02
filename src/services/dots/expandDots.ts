import { dotBaseDuration } from './constants'
import type { DotExpansion } from './types'
import type { DotFreezePeriod } from '@/prisma-generated-pn-types'

type FreezePeriod = Pick<DotFreezePeriod, 'start' | 'end'>

/**
 * Expands dots with their infered expiery. Expiery is never stored on a dot - it follows from when the
 * dot was given, how many dots the user already had queued up at that point, and which freeze periods
 * the queue has passed through.
 *
 * The dots of a user form a queue: only one dot value is being served at a time, and it takes
 * {@link dotBaseDuration} of unfrozen time to serve one. A new dot therefore starts being served when
 * the last value of the previous dot expires, or when it is given if the queue has already run dry.
 *
 * @param dots - The dots of a single user. May be in any order - they are served oldest first.
 * @param freezePeriods - All freeze periods. Time inside a freeze period does not serve any dot.
 * @param now - The point in time to measure {@link DotExpansion.valueLeft} against.
 * @returns The dots in the order they are served, i.e. in ascending order of expiery.
 */
export function expandDots<DotType extends { value: number, createdAt: Date }>(
    dots: DotType[],
    freezePeriods: FreezePeriod[],
    now: Date = new Date(),
): (DotType & DotExpansion)[] {
    const disjointFreezePeriods = mergeFreezePeriods(freezePeriods)

    return [...dots]
        .sort((first, second) => first.createdAt.getTime() - second.createdAt.getTime())
        .reduce<(DotType & DotExpansion)[]>((expanded, dot) => {
            const queueEnd = expanded.at(-1)?.expieryForEachDotValue.at(-1)
            const servedFrom = queueEnd && queueEnd > dot.createdAt ? queueEnd : dot.createdAt

            const expieryForEachDotValue = Array.from({ length: dot.value }).reduce<Date[]>(
                expieries => [
                    ...expieries,
                    addUnfrozenTime(expieries.at(-1) ?? servedFrom, dotBaseDuration, disjointFreezePeriods)
                ],
                []
            )

            return [...expanded, {
                ...dot,
                expieryForEachDotValue,
                valueLeft: expieryForEachDotValue.filter(expiery => expiery > now).length,
            }]
        }, [])
}

/**
 * Merges overlapping freeze periods into a sorted list of disjoint periods, so that time covered by
 * several freeze periods is only frozen once.
 */
function mergeFreezePeriods(freezePeriods: FreezePeriod[]): FreezePeriod[] {
    return [...freezePeriods]
        .sort((first, second) => first.start.getTime() - second.start.getTime())
        .reduce<FreezePeriod[]>((merged, period) => {
            const last = merged.at(-1)
            if (!last || period.start > last.end) return [...merged, period]
            return [
                ...merged.slice(0, -1),
                { start: last.start, end: period.end > last.end ? period.end : last.end },
            ]
        }, [])
}

/**
 * Finds the point in time reached by spending `duration` milliseconds of unfrozen time from `start`,
 * i.e. the time it takes to serve one dot value, with all frozen time skipped over.
 *
 * @param freezePeriods - Disjoint freeze periods sorted ascending by start, see {@link mergeFreezePeriods}.
 */
function addUnfrozenTime(start: Date, duration: number, freezePeriods: FreezePeriod[]): Date {
    const served = freezePeriods.reduce((progress, period) => {
        // Periods already passed - either before the start, or jumped over by an earlier period.
        if (period.end <= progress.cursor) return progress

        const unfrozenBeforePeriod = period.start.getTime() - progress.cursor.getTime()
        // The remaining time is spent before this period begins, so no later period matters either.
        if (unfrozenBeforePeriod >= progress.remaining) return progress

        return {
            cursor: period.end,
            // Negative when the cursor is inside the period - then no unfrozen time is spent at all.
            remaining: progress.remaining - Math.max(unfrozenBeforePeriod, 0),
        }
    }, { cursor: start, remaining: duration })

    return new Date(served.cursor.getTime() + served.remaining)
}
