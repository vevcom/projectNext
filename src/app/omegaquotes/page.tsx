import OmegaquoteList from './omegaquotesQuoteList'
import OmegaquoteQuote from './omegaquotesQuote'
import CreateOmegaquoteForm from './CreateOmegaquoteForm'
import OmegaquotePagingProvider from '@/context/paging/OmegaquotesPaging'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readQuotesPageAction } from '@/actions/omegaquotes/read'
import { getUser } from '@/auth/getUser'
import { notFound } from 'next/navigation'
import { v4 as uuid } from 'uuid'
import type { PageSizeOmegaquote } from '@/context/paging/OmegaquotesPaging'

export default async function OmegaQuotes() {
    const { permissions } = await getUser({
        shouldRedirect: true,
        requiredPermissions: [['OMEGAQUOTES_READ']],
    })

    const showCreateButton = permissions.includes('OMEGAQUOTES_WRITE')

    const pageSize: PageSizeOmegaquote = 20

    const readQuotes = await readQuotesPageAction({
        page: {
            pageSize,
            page: 0,
            cursor: null,
        },
        details: undefined
    })
    if (!readQuotes.success) notFound()
    const quotes = readQuotes.data

    return (
        <PageWrapper title="Omega Quotes" headerItem={
            showCreateButton && <CreateOmegaquoteForm/>
        }>
            <OmegaquotePagingProvider
                startPage={{
                    pageSize,
                    page: 1,
                }}
                details={undefined}
                serverRenderedData={quotes}
            >
                <main>
                    <OmegaquoteList
                        serverRendered={quotes.map(q => <OmegaquoteQuote key={uuid()} quote={q}/>)}
                    />
                </main>
            </OmegaquotePagingProvider>
        </PageWrapper>
    )
}
