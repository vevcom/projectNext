import type { dotsIncluder } from './constants'
import type { Prisma } from '@/prisma-generated-pn-types'

/**
 * The infered fields of a dot. None of them are stored on the dot itself - they are calculated from
 * all the dots of the user together with the freeze periods, see expandDots.
 */
export type DotExpansion = {
    /**
     * An array of dot value length with expiry time of each dot value.
     * The 0th index is the first dot value, the 1st index is the second dot value, and so on.
     */
    expieryForEachDotValue: Date[],
    /**
     * between 0 and value of dot
    */
    valueLeft: number,
}

export type DotExpanded = Prisma.DotGetPayload<{
    include: typeof dotsIncluder,
}> & DotExpansion
