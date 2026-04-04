import styles from './page.module.scss'
import CreateMailAlias from './createMailAliasForm'
import CreateMailingList from './createMailingListForm'
import CreateMailaddressExternal from './createMailaddressExternalForm'
import MailListView from './mailListView'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readMailAliasesAction } from '@/services/mail/alias/actions'
import { readMailingListsAction } from '@/services/mail/list/actions'
import { readMailAddressExternalAction } from '@/services/mail/mailAddressExternal/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { ServerSession } from '@/auth/session/ServerSession'

export default async function MailSettings() {
    const { permissions } = await ServerSession.fromNextAuth()

    const createMailAlias = permissions.includes('MAILALIAS_ADMIN')
    const createMailingList = permissions.includes('MAILINGLIST_CREATE')
    const createMailaddressExternal = permissions.includes('MAILADDRESS_EXTERNAL_CREATE')

    const showAdminPanel = createMailAlias || createMailingList || createMailaddressExternal

    const [
        mailAliases,
        mailingLists,
        mailAddressesExternal,
    ] = await Promise.all([
        readMailAliasesAction().then(unwrapActionReturn),
        readMailingListsAction().then(unwrapActionReturn),
        readMailAddressExternalAction().then(unwrapActionReturn),
    ])

    return (
        <PageWrapper
            title="Innkommende elektronisk post"
        >
            {showAdminPanel && <div className={styles.adminContainer}>
                {createMailAlias ? <div>
                    <CreateMailAlias />
                </div> : null }
                {createMailingList ? <div>
                    <CreateMailingList />
                </div> : null }
                { createMailaddressExternal ? <div>
                    <CreateMailaddressExternal />
                </div> : null }
            </div>}


            <MailListView
                mailAliases={mailAliases}
                mailingLists={mailingLists}
                mailAddressesExternal={mailAddressesExternal}
            />
        </PageWrapper>
    )
}
