"use server"

import styles from "./page.module.scss"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper";
import Link from "next/link";
import CreateMailAlias from "./createMailAliasForm";
import CreateMailingList from "./createMailingListForm";
import CreateMailaddressExternal from "./createMailaddressExternalForm";
import { getUser } from "@/auth/getUser";

export default async function mailAliases() {

    const { permissions } = await getUser({
        userRequired: true,
        shouldRedirect: true,
    })

    const createMailAlias = permissions.includes("MAILALIAS_CREATE")
    const createMailingList = permissions.includes("MAILINGLIST_CREATE")
    const createMailaddressExternal = permissions.includes("MAILADDRESS_EXTERNAL_CREATE")

    const showAdminPanel = createMailAlias || createMailingList || createMailaddressExternal

    return (
        <PageWrapper
            title="Innkommende elektronisk post"
        >
            <Link href="./mail/alias">Aliases</Link><br/>
            <Link href="./mail/list">Lister</Link><br/>
            <Link href="./mail/mailAddressExternal">Eksterne mottaker adresser</Link><br/>
            <Link href="./mail/user">Brukere</Link><br/>

            {showAdminPanel ? <div className={styles.adminContainer}>
                {createMailAlias ? <div>
                    <CreateMailAlias />
                </div> : null }
                {createMailingList ? <div>
                    <CreateMailingList />
                </div> : null }
                { createMailaddressExternal ? <div>
                    <CreateMailaddressExternal />
                </div> : null }
            </div> : null}
        </PageWrapper>
    )
}