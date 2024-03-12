import OmegaquoteList from './omegaquotesQuoteList'
import OmegaquoteQuote from './omegaquotesQuote'
import CreateOmegaquoteForm from './CreateOmegaquoteForm'
import OmegaquotePagingProvider from '@/context/paging/omegaquotesPaging'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readQuotesPage } from '@/actions/omegaquotes/read'
import { getUser } from '@/auth/user'
import { notFound } from 'next/navigation'
import { v4 as uuid } from 'uuid'
import type { PageSizeOmegaquote } from '@/context/paging/omegaquotesPaging'

export default async function OmegaQuotes() {
    const { user } = await getUser({
        required: true,
        requiredPermissions: ['OMEGAQUOTES_READ'],
    })

    const showCreateButton = user.permissions.includes('OMEGAQUOTES_WRITE')

    const pageSize: PageSizeOmegaquote = 20

    const readQuotes = await readQuotesPage({ page: { pageSize, page: 0 }, details: undefined })
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
