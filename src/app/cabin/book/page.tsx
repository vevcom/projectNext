import StateWrapper from './stateWrapper'
import SpecialCmsParagraph from '@/app/_components/Cms/CmsParagraph/SpecialCmsParagraph'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { default as DateComponent } from '@/components/Date/Date'
import {
    readCabinAvailabilityAction,
    readCabinProductsActiveAction,
    readPublicPricePeriodsAction,
    readReleasePeriodsAction,
    readSpecialCmsParagraphCabinContractAction,
    updateSpecialCmsParagraphCabinContractAction
} from '@/services/cabin/actions'
import { displayDate } from '@/lib/dates/displayDate'
import { Session } from '@/auth/session/Session'
import { cabinBookingAuth } from '@/services/cabin/booking/auth'
import type { ReleasePeriod } from '@prisma/client'

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
    const pricePeriods = unwrapActionReturn(await readPublicPricePeriodsAction())
    const cabinProducts = unwrapActionReturn(await readCabinProductsActiveAction())
    const session = await Session.fromNextAuth()
    const canBookCabin = cabinBookingAuth.createCabinBookingNoUser.dynamicFields({}).auth(session)
    const canBookBed = cabinBookingAuth.createBedBookingNoUser.dynamicFields({}).auth(session)

    return <PageWrapper
        title="Heutte Booking"
    >
        {nextReleasePeriod &&
            <p>
                Neste slipptid er <DateComponent date={nextReleasePeriod.releaseTime} />,
                da slippes bookinger fram til <DateComponent date={nextReleasePeriod.releaseUntil} />
            </p>
        }
        {pricePeriods.length > 1 &&
            <p>
                Nye priser fra: {pricePeriods.slice(1).map(period => displayDate(period.validFrom, false)).join(', ')}
            </p>
        }
        <StateWrapper
            cabinAvailability={cabinAvailability}
            releaseUntil={releaseUntil}
            cabinProducts={cabinProducts}
            canBookCabin={canBookCabin.authorized}
            canBookBed={canBookBed.authorized}
            pricePeriods={pricePeriods}
        />

        <SpecialCmsParagraph
            special="CABIN_CONTRACT"
            readSpecialCmsParagraphAction={readSpecialCmsParagraphCabinContractAction}
            updateCmsParagraphAction={updateSpecialCmsParagraphCabinContractAction}
        />
    </PageWrapper>
}
