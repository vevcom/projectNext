"use client"

import { MailAliasExtended } from "@/server/mailalias/Types"
import styles from "./mailAliasView.module.scss"
import MailAliasMeta from "./mailAliasMeta"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper"
import MailAliasRawAddress from "./mailAliasRawAddress"


export default function MailAliasView({
    mailAlias,
}: {
    mailAlias: MailAliasExtended
}) {

    return (
        <PageWrapper title={mailAlias.address} titleClassName={styles.pageWrapperTitle}>
            <MailAliasMeta address={mailAlias.address} description={mailAlias.description} aliasId={mailAlias.id} />
            <MailAliasRawAddress rawAddresses={mailAlias.rawAddress} aliasId={mailAlias.id} />
        </PageWrapper>
    )
}