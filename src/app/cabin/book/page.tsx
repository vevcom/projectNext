import StateWrapper from './stateWrapper'
import SpecialCmsParagraph from '@/app/_components/Cms/CmsParagraph/SpecialCmsParagraph'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readCabinAvailabilityAction, readReleasePeriodsAction } from '@/actions/cabin'
import type { ReleasePeriod } from '@prisma/client'
import { displayDate } from '@/lib/dates/displayDate'

function findCurrentReleasePeriod(releasePeriods: ReleasePeriod[]) {
    const filtered = releasePeriods.filter(releasePeriod => {
        const now = new Date()
        return releasePeriod.releaseTime < now && now < releasePeriod.releaseUntil
    })

    if (filtered.length === 0) return new Date()
    return filtered[0].releaseUntil
}

function findNextReleasePeriod(releasePeriods: ReleasePeriod[]) {
    const filtered = releasePeriods.filter(releasePeriod => {
        const now = new Date()
        return now < releasePeriod.releaseTime
    })

    if (filtered.length === 0) return null
    return filtered[0]
}

export default async function CabinBooking() {
    const cabinAvailability = unwrapActionReturn(await readCabinAvailabilityAction())
    const releasePeriods = unwrapActionReturn(await readReleasePeriodsAction())
    const releaseUntil = findCurrentReleasePeriod(releasePeriods)
    const nextReleasePeriod = findNextReleasePeriod(releasePeriods)
    return <PageWrapper
        title="Heutte Booking"
    >
        {nextReleasePeriod &&
            <p>
                Neste slipptid er {displayDate(nextReleasePeriod.releaseTime, false)},
                da slippes bookinger fram til {displayDate(nextReleasePeriod.releaseUntil, false)}
            </p>
        }
        <StateWrapper cabinAvailability={cabinAvailability} releaseUntil={releaseUntil} />

        <SpecialCmsParagraph special="CABIN_CONTRACT" />
    </PageWrapper>
}
