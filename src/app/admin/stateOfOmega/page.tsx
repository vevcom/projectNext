import { getUser } from '@/auth/getUser'
import styles from './page.module.scss'
import { notFound } from 'next/navigation'
import { readCurrentOmegaOrderAction } from '@/actions/omegaOrder/read'
import CreateOrder from './CreateOrder'

export default async function stateOfOmega() {
    const { authorized } = await getUser({
        requiredPermissions: [['OMEGA_ORDER_CREATE']]
    })
    if (!authorized) return notFound() //TODO: improve error handling

    const currentOreder = await readCurrentOmegaOrderAction()
    if (!currentOreder.success) return notFound() //TODO: improve error handling

    return (
        <div className={styles.wrapper}>
            <h1>Omega er i orden: { currentOreder.data.order }</h1>
            <CreateOrder />
        </div>
    )
}
