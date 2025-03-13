import { calculateLedgerAccountBalance } from "@/actions/ledger/ledgerAccount"
import { unwrapActionReturn } from "@/app/redirectToErrorPage"
import { displayAmount } from "@/lib/currency/convert"

type Props = {
    accountId: number,
    showFees?: boolean,
}

export default async function LedgerAccountBalance({ accountId, showFees }: Props) {
    const balance = unwrapActionReturn(await calculateLedgerAccountBalance({ id: accountId }))
    
    return <div>
        <p>Balanse: <b>{displayAmount(balance.total)}</b> Kluengende muent</p>
        {showFees && <p><i>Avgifter: {displayAmount(balance.fees)} Kluengende muent</i></p>}
    </div>
}