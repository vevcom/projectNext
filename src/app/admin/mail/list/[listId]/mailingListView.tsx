
import styles from "./mailingListView.module.scss"
import MailAliasMeta from "./mailingListMeta"
import PageWrapper from "@/app/components/PageWrapper/PageWrapper"
import MailAliasDestory from "./mailingListDestroy"
import { MailingListExtended } from "@/server/mail/list/Types"


export default function MailingListView({
    mailingList,
}: {
    mailingList: MailingListExtended,
}) {

    return (
        <PageWrapper title={mailingList.name} titleClassName={styles.pageWrapperTitle}>
            <div className={styles.mailingListView}>
                <MailAliasMeta name={mailingList.name} description={mailingList.description} mailingListId={mailingList.id} />
                <MailAliasDestory mailingListId={mailingList.id}/>
            </div>
        </PageWrapper>
    )
}