import OmegaquoteList from './omegaquotesQuoteList'
import OmegaquoteQuote from './omegaquotesQuote'
import OmegaquotePagingProvider from '@/context/paging/omegaquotesPaging'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import type { PageSizeOmegaquote } from '@/context/paging/omegaquotesPaging'
import { readQuotesPage } from '@/actions/quotes/read'
import { requireUser } from '@/auth'
import { readPermissionsOfUser } from '@/actions/permissions/read'
import { notFound } from 'next/navigation'
import { Permission } from '@prisma/client'
import { v4 as uuid } from 'uuid'
import CreateOmegaquoteForm from './CreateOmegaquoteForm'

export default async function OmegaQuotes() {
    const user = await requireUser({
        permissions: [Permission.OMEGAQUOTES_READ]
    })

    const userPermissions = await readPermissionsOfUser(user.id)
    const showCreateButton = (userPermissions.success && userPermissions.data.has('OMEGAQUOTES_WRITE'))

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
