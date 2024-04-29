
import { MailAddressExternal, MailAlias, MailingList } from "@prisma/client"
import styles from "./mailListView.module.scss"
import MailList from "./mailList"



export default function MailListView({
    mailAliases,
    mailingLists,
    mailAddressesExternal,
}: {
    mailAliases: MailAlias[],
    mailingLists: MailingList[],
    mailAddressesExternal: MailAddressExternal[]
}) {

    return <div className={styles.listView}>
        <div>
            <MailList items={mailAliases.map(a => ({
                id: a.id,
                label: a.address
            }))} type="alias" />
        </div>
        <div>
            <MailList items={mailingLists.map(a => ({
                id: a.id,
                label: a.name
            }))} type="mailingList" />
        </div>
        <div>
            <MailList items={mailAddressesExternal.map(a => ({
                id: a.id,
                label: a.address
            }))} type="mailaddressExternal" />
        </div>
    </div>
}