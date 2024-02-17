import styles from './page.module.scss'
import OmegaquoteList from './omegaquotesQuoteList'
import OmegaquoteQuote from './omegaquotesQuote'
import OmegaquotePagingProvider from '@/context/paging/omegaquotesPaging'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import PopUp from '@/components/PopUp/PopUp'
import Form from '@/components/Form/Form'
import { createQuote } from '@/actions/quotes/create'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/components/UI/Textarea'
import { readQuotesPage } from '@/actions/quotes/read'
import { requireUser } from '@/auth'
import { notFound } from 'next/navigation'
import { v4 as uuid } from 'uuid'
import type { PageSizeOmegaquote } from '@/context/paging/omegaquotesPaging'

export default async function OmegaQuotes() {
    const user = await requireUser({
        permissions: ['OMEGAQUOTES_READ']
    })

    const showCreateButton = user.permissions.includes('OMEGAQUOTES_WRITE')

    const pageSize: PageSizeOmegaquote = 20

    const readQuotes = await readQuotesPage({ page: { pageSize, page: 0 }, details: undefined })
    if (!readQuotes.success) notFound()
    const quotes = readQuotes.data

    return (
        <PageWrapper title="Omega Quotes" headerItem={
            showCreateButton && <PopUp
                PopUpKey="new_omega_quote"
                showButtonContent="Ny Omegaquote"
                showButtonClass={styles.button}
            >
                <Form title="Ny Omegaquote" submitText="Legg til" action={createQuote} className={styles.popupForm}>
                    <Textarea
                        name="quote"
                        label="Omegaquote"
                        placeholder="Omegaquote"
                        className={styles.textarea}
                    />
                    <TextInput label="Sagt av" name="author" className={styles.author}/>
                </Form>
            </PopUp>
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
