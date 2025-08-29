import styles from './LedgerAccountBalance.module.scss'
// import { calculateLedgerAccountBalance } from '@/actions/ledger/ledgerAccount'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { displayAmount } from '@/lib/currency/convert'

type Props = {
    accountId: number,
    showFees?: boolean,
}

export default async function LedgerAccountBalance({ accountId, showFees }: Props) {
    const balance = { amount: 100, fees: 2 } // unwrapActionReturn(await calculateLedgerAccountBalance({ id: accountId }))

    return <div className={styles.LedgerAccountBalance}>
        <div className={styles.amountRow}>
            <div>Saldo</div>
            <div className={styles.total}>{displayAmount(balance.amount)}</div>
            <div className={styles.currencySymbol}>Kluengende Muente</div>
        </div>
        {showFees && <div className={styles.feesRow}>
            <div>Avgifter</div>
            <div className={styles.total}>{displayAmount(balance.fees)}</div>
            <div className={styles.currencySymbol}>Kluengende Muente</div>
        </div>}
    </div>
}
