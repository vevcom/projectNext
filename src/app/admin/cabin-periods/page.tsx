'use server'
import PageStateWrapper from './PageStateWrapper'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { readPricePeriodsAction, readReleasePeriodsAction } from '@/services/cabin/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'


export default async function CabinCalendarPage() {
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
