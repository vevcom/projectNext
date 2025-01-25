'use server'
import PageStateWrapper from './PageStateWrapper'
import PageWrapper from '@/app/_components/PageWrapper/PageWrapper'
import { readReleasePeriodsAction } from '@/actions/cabin'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'


export default async function CabinCalendarPage() {
    const releasePeriods = unwrapActionReturn(await readReleasePeriodsAction())
    return <PageWrapper
        title="Heutte Kalender"
    >
        <PageStateWrapper releasePeriods={releasePeriods} />
    </PageWrapper>
}
