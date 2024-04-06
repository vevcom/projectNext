
import { MailAliasExtended } from "@/server/mailalias/Types"
import styles from "./mailAliasView.module.scss"
import MailAliasMeta from "./mailAliasMeta"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper"
import MailAliasRawAddress from "./mailAliasRawAddress"
import MailAliasDestory from "./mailAliasDestroy"
import MailAliasForward from "./mailAliasForward"


export default function MailAliasView({
    mailAlias,
}: {
    mailAlias: MailAliasExtended
}) {

    return (
        <PageWrapper title={mailAlias.address} titleClassName={styles.pageWrapperTitle}>
            <div className={styles.mailAliasView}>
                <MailAliasMeta address={mailAlias.address} description={mailAlias.description} aliasId={mailAlias.id} />
                <MailAliasRawAddress rawAddresses={mailAlias.rawAddress} aliasId={mailAlias.id} />
                <MailAliasForward
                    aliasId={mailAlias.id}
                    title="Videresender fra"
                    addresses={mailAlias.forwardsFrom.map(a => a.source)}
                    possibleOptions={[]}
                    chooseSource={true}
                />
                <MailAliasForward
                    aliasId={mailAlias.id}
                    title="Videresender til"
                    addresses={mailAlias.forwardsTo.map(a => a.drain)}
                    possibleOptions={[]}
                    chooseSource={false}
                />
                <MailAliasDestory aliasId={mailAlias.id}/>
            </div>
        </PageWrapper>
    )
}