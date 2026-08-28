'use server'
import PageStateWrapper from './PageStateWrapper'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { readPricePeriodsAction, readReleasePeriodsAction } from '@/services/cabin/actions'
import { cabinPricePeriodAuth } from '@/services/cabin/pricePeriod/auth'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { ServerSession } from '@/auth/session/ServerSession'


export default async function CabinCalendarPage() {
    cabinPricePeriodAuth.create.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).redirectOnUnauthorized({ returnUrl: '/admin/cabin-periods' })

    const releasePeriods = unwrapActionReturn(await readReleasePeriodsAction())
    const pricePeriods = unwrapActionReturn(await readPricePeriodsAction())

    return <PageWrapper
        title="Heutte perioder"
    >
        <PageStateWrapper
            releasePeriods={releasePeriods}
            pricePeriods={pricePeriods}
        />
    </PageWrapper>
}
