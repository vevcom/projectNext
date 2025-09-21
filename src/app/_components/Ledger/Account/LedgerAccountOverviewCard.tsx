import Card from "@/components/UI/Card";
import DepositModal from "@/components/Ledger/Modals/DepositModal";
import PayoutModal from "@/components/Ledger/Modals/PayoutModal";
import LedgerAccountBalance from "./LedgerAccountBalance";

type Props = {
    ledgerAccountId: number,
}

export default function LedgerAccountOverview({ ledgerAccountId }: Props) {
    return <Card>
        <h2>Kontooversikt</h2>
        <LedgerAccountBalance ledgerAccountId={ledgerAccountId} showFees />        
        <DepositModal ledgerAccountId={ledgerAccountId} />
        <PayoutModal ledgerAccountId={ledgerAccountId} />
    </Card>   
}