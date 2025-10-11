'use server'

import styles from './page.module.scss'
import CreateMailAlias from './createMailAliasForm'
import CreateMailingList from './createMailingListForm'
import CreateMailaddressExternal from './createMailaddressExternalForm'
import MailListView from './mailListView'
import { getUser } from '@/auth/session/getUser'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import { readMailAliases } from '@/services/mail/alias/read'
import { readMailingLists } from '@/services/mail/list/read'
import { readMailAddressExternal } from '@/services/mail/mailAddressExternal/read'

export default async function MailSettings() {
    const { permissions } = await getUser({
        userRequired: true,
        shouldRedirect: true,
    })

    const createMailAlias = permissions.includes('MAILALIAS_CREATE')
    const createMailingList = permissions.includes('MAILINGLIST_CREATE')
    const createMailaddressExternal = permissions.includes('MAILADDRESS_EXTERNAL_CREATE')

    const showAdminPanel = createMailAlias || createMailingList || createMailaddressExternal

    const [
        mailAliases,
        mailingLists,
        mailAddressesExternal,
    ] = await Promise.all([
        readMailAliases(),
        readMailingLists(),
        readMailAddressExternal(),
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
