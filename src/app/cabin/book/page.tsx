import StateWrapper from './stateWrapper'
import SpecialCmsParagraph from '@/app/_components/Cms/CmsParagraph/SpecialCmsParagraph'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readCabinAvailabilityAction, readCabinProductsAction, readReleasePeriodsAction } from '@/actions/cabin'
import { displayDate } from '@/lib/dates/displayDate'
import { Session } from '@/auth/Session'
import type { ReleasePeriod } from '@prisma/client'
import { CabinBookingAuthers } from '@/services/cabin/booking/authers'

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
    const cabinProducts = unwrapActionReturn(await readCabinProductsAction())
    const session = await Session.fromNextAuth()
    const canBookCabin = CabinBookingAuthers.createCabinBookingUserAttached.dynamicFields({}).auth(session)
    const canBookBed = CabinBookingAuthers.createBedBookingUserAttached.dynamicFields({}).auth(session)
    return <PageWrapper
        title="Heutte Booking"
    >
        {nextReleasePeriod &&
            <p>
                Neste slipptid er {displayDate(nextReleasePeriod.releaseTime, false)},
                da slippes bookinger fram til {displayDate(nextReleasePeriod.releaseUntil, false)}
            </p>
        }
        <StateWrapper
            cabinAvailability={cabinAvailability}
            releaseUntil={releaseUntil}
            cabinProducts={cabinProducts}
            canBookCabin={canBookCabin.authorized}
            canBookBed={canBookBed.authorized}
        />

        <SpecialCmsParagraph special="CABIN_CONTRACT" />
    </PageWrapper>
}
