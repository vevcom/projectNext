import styles from './page.module.scss'
import CreateOrder from './CreateOrder'
import Requirements from './Requirements'
import { readCurrentOmegaOrderAction } from '@/services/omegaOrder/actions'
import { omegaOrderAuth } from '@/services/omegaOrder/auth'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { ServerSession } from '@/auth/session/ServerSession'
import Date from '@/components/Date/Date'
import type { OmegaOrderRequirement } from './Requirements'

export default async function stateOfOmega() {
    omegaOrderAuth.create.dynamicFields({}).auth(
        await ServerSession.fromNextAuth()
    ).redirectOnUnauthorized({ returnUrl: '/admin/state-of-omega' })

    const currentOrder = unwrapActionReturn(await readCurrentOmegaOrderAction())

    // TODO: Read requirements through a service action once implemented.
    const requirements: OmegaOrderRequirement[] = [
        { description: 'Alle komiteer er på nåværende orden eller pensjonert', fulfilled: true },
        { description: 'Alle interessegrupper er på nåværende orden eller pensjonert', fulfilled: false },
    ]
    const allRequirementsFulfilled = requirements.every(requirement => requirement.fulfilled)

    return (
        <div className={styles.wrapper}>
            <h1>Omega er i orden {currentOrder.order}</h1>
            <p>
                Ordenen til Omega ble sist inkrementert <Date date={currentOrder.createdAt} includeTime={false} />
            </p>
            <div className={styles.main}>
                <div className={`${styles.order} ${styles.currentOrder}`}>
                    <span className={styles.label}>Nåværende orden</span>
                    <span className={styles.number}>{currentOrder.order}</span>
                </div>
                <div className={styles.requirements}>
                    <Requirements requirements={requirements} />
                </div>
                <div className={`${styles.order} ${styles.nextOrder}`}>
                    <span className={styles.label}>Neste orden</span>
                    <span className={styles.number}>{currentOrder.order + 1}</span>
                    <CreateOrder allRequirementsFulfilled={allRequirementsFulfilled} />
                </div>
            </div>
        </div>
    )
}
