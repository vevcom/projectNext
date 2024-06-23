

import NotificationMethodCheckboxes from "@/components/NotificaionMethodSelector/NotificationMethodCheckboxes";
import { ExpandedNotificationChannel, NotificationMethodGeneral, allMethodsOff } from "@/server/notifications/Types";
import styles from "./subscriptionItem.module.scss"
import { v4 as uuid } from 'uuid'
import { NotificationBranch } from "./Types";


export default function SubscriptionItem({
    branch,
    depth,
    onChange,
}: {
    branch: NotificationBranch,
    depth?: number,
    onChange?: (branchId: number, method: NotificationMethodGeneral) => void
}) {

    const checkboxes = NotificationMethodCheckboxes({
        methods: branch.subscription?.methods ?? allMethodsOff,
        editable: branch.availableMethods,
        onChange: (method: NotificationMethodGeneral) => {
            if (!onChange) {
                return
            }

            onChange(branch.id, method)
        }
    })

    return <>
        <tr className={styles.subscriptionItem}>
            <td
                className={styles.channelName}
                style={{
                    '--depth': depth ?? 0,
                } as React.CSSProperties}
            >
                <b>{branch.name}</b><br/>
                {branch.description}
            </td>

            {checkboxes.map(c => <td
                    key={uuid()}
                    className={styles.checkbox}
                >
                    <div>{c}</div>
                </td>
            )}
        </tr>
        
        {branch.children.map(b => <SubscriptionItem
            key={uuid()}
            branch={b}
            depth={(depth ?? 0) + 1}
            onChange={onChange}
        />)}
    </>
}