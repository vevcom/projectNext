'use server'
import PageStateWrapper from './PageStateWrapper'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readAllBookingPeriodsAction, readReleaseGroupsAction } from '@/actions/cabin'


export default async function CabinCalendarPage() {
    const bookingPeriods = unwrapActionReturn(await readAllBookingPeriodsAction(null))
    const releaseGroups = unwrapActionReturn(await readReleaseGroupsAction(null))
    return <PageWrapper
        title="Heutte Kalender"
    >
        <PageStateWrapper bookingPeriods={bookingPeriods} releaseGroups={releaseGroups} />
    </PageWrapper>
}
