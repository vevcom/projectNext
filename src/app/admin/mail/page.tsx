"use server"

import styles from "./page.module.scss"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import Link from "next/link";
import CreateMailAlias from "./createMailAliasForm";
import CreateMailingList from "./createMailingListForm";
import CreateMailaddressExternal from "./createMailaddressExternalForm";
import { getUser } from "@/auth/getUser";
import MailListView from "./mailListView";
import { readAllMailAliases } from "@/server/mail/alias/read";
import { readAllMailingLists } from "@/server/mail/list/read";
import { readAllMailAddressExternal } from "@/server/mail/mailAddressExternal/read";

export default async function mailAliases() {

    const { permissions } = await getUser({
        userRequired: true,
        shouldRedirect: true,
    })

    const createMailAlias = permissions.includes("MAILALIAS_CREATE")
    const createMailingList = permissions.includes("MAILINGLIST_CREATE")
    const createMailaddressExternal = permissions.includes("MAILADDRESS_EXTERNAL_CREATE")

    const showAdminPanel = createMailAlias || createMailingList || createMailaddressExternal

    const [
        mailAliases,
        mailingLists,
        mailAddressesExternal,
    ] = await Promise.all([
        readAllMailAliases(),
        readAllMailingLists(),
        readAllMailAddressExternal(),
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