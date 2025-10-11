

import styles from './subscriptionItem.module.scss'
import NotificationMethodCheckboxes from '@/components/NotificaionMethodSelector/NotificationMethodCheckboxes'
import { NotificationConfig } from '@/services/notifications/config'
import { v4 as uuid } from 'uuid'
import React from 'react'
import type { NotificationMethodGeneral } from '@/services/notifications/Types'
import type { NotificationBranch } from './Types'


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
        methods: branch.subscription?.methods ?? NotificationConfig.allMethodsOff,
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
                <b>{branch.name}</b><br />
                {branch.description}
            </td>

            {checkboxes.map(checkbox => <td
                key={uuid()}
                className={styles.checkbox}
            >
                <div>{checkbox}</div>
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
