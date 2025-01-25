import SpecialCmsParagraph from '@/app/_components/Cms/CmsParagraph/SpecialCmsParagraph'
import StateWrapper from './stateWrapper'
import PageWrapper from '@/components/PageWrapper/PageWrapper'


export default function CabinBooking() {
    return <PageWrapper
        title="Heutte Booking"
    >
        <StateWrapper />

        <SpecialCmsParagraph special="CABIN_CONTRACT" />
    </PageWrapper>
}
