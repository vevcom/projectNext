import styles from './page.module.scss'
import Countdown from './Countdown'
import type { PropTypes } from '@/app/applications/[periodName]/page'
import { readApplicationPeriodAction } from '@/actions/applications/periods/read'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readSpecialImageAction } from '@/images/read'

export default async function ApplicationPeriodCountdown({ params }: PropTypes) {
    const period = unwrapActionReturn(await readApplicationPeriodAction({ name: decodeURIComponent(params.periodName) }))
    const defaultCommitteeLogo = unwrapActionReturn(await readSpecialImageAction({ special: 'DAFAULT_COMMITTEE_LOGO' }))

    return (
        <div className={styles.wrapper}>
            <Countdown period={period} defaultCommitteeLogo={defaultCommitteeLogo} />
        </div>
    )
}
