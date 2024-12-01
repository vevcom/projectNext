'use server'
import PageStateWrapper from './PageStateWrapper'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readReleasePeriodsAction } from '@/actions/cabin'


export default async function CabinCalendarPage() {
    const releaseGroups = unwrapActionReturn(await readReleasePeriodsAction(null))
    return <PageWrapper
        title="Heutte Kalender"
    >
        <PageStateWrapper bookingPeriods={[]} releaseGroups={releaseGroups} />
    </PageWrapper>
}
