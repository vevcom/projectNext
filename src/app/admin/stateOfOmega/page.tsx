import styles from './page.module.scss'
import CreateOrder from './CreateOrder'
import { readCurrentOmegaOrderAction } from '@/services/omegaOrder/actions'
import { omegaOrderAuth } from '@/services/omegaOrder/auth'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { ServerSession } from '@/auth/session/ServerSession'

export default async function stateOfOmega() {
    omegaOrderAuth.create.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).redirectOnUnauthorized({ returnUrl: '/admin/state-of-omega' })

    const currentOrder = unwrapActionReturn(await readCurrentOmegaOrderAction())

    return (
        <div className={styles.wrapper}>
            <div className={styles.plaque}>
                <p className={styles.label}>Omega er i orden</p>
                <h1 className={styles.order}>{ currentOrder.order }</h1>
            </div>
            <CreateOrder />
        </div>
    )
}
