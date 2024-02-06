import styles from './page.module.scss'
import OmegaquoteList from './omegaquotesQuoteList'
import OmegaquoteQuote from './omegaquotesQuote'
import OmegaquotePagingProvider, { PageSizeOmegaquote } from '@/context/paging/omegaquotesPaging'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import PopUp from '@/components/PopUp/PopUp'
import Form from '@/components/Form/Form'
import create from '@/actions/quotes/create'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/app/components/UI/Textarea'
import { readPage } from '@/actions/quotes/read'
import { requireUser } from '@/auth'
import { readPermissionsOfUser } from '@/actions/permissions'
import { notFound } from 'next/navigation'
import { Permission } from '@prisma/client'
import { v4 as uuid } from 'uuid'

export default async function OmegaQuotes() {
    const user = await requireUser({
        permissions: [Permission.OMEGAQUOTES_READ]
    })

    const userPermissions = await readPermissionsOfUser(user.id)
    const showCreateButton = (userPermissions.success && userPermissions.data.has('OMEGAQUOTES_WRITE'))

    const pageSize : PageSizeOmegaquote = 20

    const readQuotes = await readPage({ page: { pageSize, page: 0 }, details: undefined })
    if (!readQuotes.success) notFound()
    const quotes = readQuotes.data

    return (
        <PageWrapper title="Omega Quotes" headerItem={
            showCreateButton && <PopUp
                PopUpKey="new_omega_quote"
                showButtonContent="Ny Omegaquote"
                showButtonClass={styles.button}
            >
                <Form title="Ny Omegaquote" submitText="Legg til" action={create} className={styles.popupForm}>
                    <Textarea
                        name="quote"
                        label="Omegaquote"
                        placeholder="Omegaquote"
                        className={styles.textarea}
                    />
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
                    <OmegaquoteList
                        serverRendered={quotes.map(q => <OmegaquoteQuote key={uuid()} quote={q}/>)}
                    />
                </main>
            </OmegaquotePagingProvider>
        </PageWrapper>
    )
}
