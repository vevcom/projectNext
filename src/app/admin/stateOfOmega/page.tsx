import styles from './page.module.scss'
import CreateOrder from './CreateOrder'
import { readCurrentOmegaOrderAction } from '@/services/omegaOrder/actions'
import { omegaOrderAuth } from '@/services/omegaOrder/auth'
import { Session } from '@/auth/session/Session'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'

export default async function stateOfOmega() {
    omegaOrderAuth.create.dynamicFields({}).auth(
        await Session.fromNextAuth()
    ).redirectOnUnauthorized({ returnUrl: '/admin/state-of-omega' })

    const currentOrder = unwrapActionReturn(await readCurrentOmegaOrderAction())

    return (
        <div className={styles.wrapper}>
            <h1>Omega er i orden: { currentOrder.order }</h1>
            <CreateOrder />
        </div>
    )
}
