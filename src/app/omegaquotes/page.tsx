import styles from './page.module.scss'
import PageWrapper from '@/components/PageWrapper/pageWrapper'
import PopUp from '@/components/PopUp/PopUp'
import Form from '@/components/Form/Form'
import create from '@/actions/quotes/create'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/app/components/UI/Textarea'
import OmegaquotePagingProvider, { PageSizeOmegaquote } from './omegaquotesPaging'
import { readPage } from '@/actions/quotes/read'
import { notFound } from 'next/navigation'
import OmegaquoteList from './omegaquotesQuoteList'
import OmegaquoteQuote from './omegaquotesQuote'

export default async function OmegaQuotes() {

    const pageSize : PageSizeOmegaquote = 50;

    const readQuotes = await readPage({ page: { pageSize, page: 0 }, details: undefined })
    if (!readQuotes.success) notFound()
    const quotes = readQuotes.data;

    return (
        <PageWrapper title="Omega Quotes" headerItem={
            <PopUp PopUpKey="new_omega_quote" showButtonContent="Ny Omegaquote" showButtonClass={styles.button}>
                <Form title="Ny Omegaquote" submitText="Legg til" action={create} className={styles.popupForm}>
                    <Textarea name="quote" label="Omegaquote" placeholder="Omegaquote" className={styles.textarea}></Textarea>
                    <TextInput label="Sagt av" name="said_by" className={styles.said_by}/>
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
                    <OmegaquoteList serverRendered={quotes.map(quote => <OmegaquoteQuote quote={quote}/>)}></OmegaquoteList>
                </main>
            </OmegaquotePagingProvider>
        </PageWrapper>
    )
}