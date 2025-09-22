import styles from './LedgerAccountBalance.module.scss'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { displayAmount } from '@/lib/currency/convert'
import { calculateLedgerAccountBalanceAction } from '@/services/ledger/ledgerAccount/actions'

type Props = {
    ledgerAccountId: number,
    showFees?: boolean,
}

export default async function LedgerAccountBalance({ ledgerAccountId: accountId, showFees }: Props) {
    const balance = unwrapActionReturn(await calculateLedgerAccountBalanceAction({ id: accountId }))

    return <div className={styles.LedgerAccountBalance}>
        <div className={styles.amountRow}>
            <div>Saldo</div>
            <div className={styles.total}>{displayAmount(balance.amount)}</div>
            <div className={styles.currencySymbol}>Muenter</div>
        </div>
        {showFees && <div className={styles.feesRow}>
            <div>Avgifter</div>
            <div className={styles.total}>{displayAmount(balance.fees)}</div>
            <div className={styles.currencySymbol}>Muenter</div>
        </div>}
    </div>
}
