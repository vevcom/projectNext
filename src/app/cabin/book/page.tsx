import SpecialCmsParagraph from '@/app/_components/Cms/CmsParagraph/SpecialCmsParagraph'
import StateWrapper from './stateWrapper'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readCabinAvailabilityAction } from '@/actions/cabin'


export default async function CabinBooking() {
    const cabinAvailability = unwrapActionReturn(await readCabinAvailabilityAction())
    return <PageWrapper
        title="Heutte Booking"
    >
        <StateWrapper cabinAvailability={cabinAvailability}/>

        <SpecialCmsParagraph special="CABIN_CONTRACT" />
    </PageWrapper>
}
