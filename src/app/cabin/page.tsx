import PageWrapper from '@/components/PageWrapper/PageWrapper'
import Link from 'next/link'


export default function Cabin() {
    return <PageWrapper
        title="Heutten"
    >
        her dukker det opp litt nais info, en artikkel og noen funky greier
        <Link href="/cabin/book">Trykk her for å Booke</Link>
    </PageWrapper>
}
