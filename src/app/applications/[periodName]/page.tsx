import PageWrapper from '@/components/PageWrapper/PageWrapper'

export type PropTypes = {
    params: {
        periodName: string
    }
}

export default async function ApplicationPeriod({ params }: PropTypes) {
    return (
        <PageWrapper title="Søknad">
            Søknad til {params.periodName}
        </PageWrapper>
    )
}
