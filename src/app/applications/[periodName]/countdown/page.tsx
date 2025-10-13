import styles from './page.module.scss'
import Countdown from './Countdown'
import { readApplicationPeriodAction } from '@/services/applications/periods/actions'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { readSpecialImageAction } from '@/services/images/actions'
import type { PropTypes } from '@/app/applications/[periodName]/page'

export default async function ApplicationPeriodCountdown({ params }: PropTypes) {
    const period = unwrapActionReturn(await readApplicationPeriodAction({
        params: {
            name: decodeURIComponent((await params).periodName)
        }
    }))
    const defaultCommitteeLogo = unwrapActionReturn(
        await readSpecialImageAction({ params: { special: 'DAFAULT_COMMITTEE_LOGO' } })
    )

    return (
        <div className={styles.wrapper}>
            <Countdown period={period} defaultCommitteeLogo={defaultCommitteeLogo} />
        </div>
    )
}
