import { bindParams } from "@/actions/bind"
import { calculateLedgerAccountBalance, readLedgerAccount } from "@/actions/ledger/ledgerAccount"
import { createPayment } from "@/actions/ledger/transactions/payments"
import { createPayout } from "@/actions/ledger/transactions/payouts"
import Form from "@/app/_components/Form/Form"
import LedgerAccountBalance from "@/app/_components/Ledger/LedgerAccountBalance"
import DepositForm from "@/app/_components/Stripe/DepositForm"
import NumberInput from "@/app/_components/UI/NumberInput"
import TextInput from "@/app/_components/UI/TextInput"
import { unwrapActionReturn } from "@/app/redirectToErrorPage"
import { getUser } from "@/auth/getUser"
import Button from "@/components/UI/Button"
import Link from "next/link"

export default async function Account() {
    const session = await getUser({
        userRequired: true,
        shouldRedirect: true,
    }) // TODO: Replace

    const account = unwrapActionReturn(await readLedgerAccount({ userId: session.user.id }))
    
    return <div>
        <h2>Konto</h2>
        <LedgerAccountBalance accountId={account.id} showFees />
        <br />
        <h3>Innskudd</h3>
        <DepositForm accountId={account.id}/>
        <br />
        <h3>Betaling</h3>
        <Form refreshOnSuccess={true} submitText="Sett inn" action={bindParams(createPayment, { fromAccountId: account.id })}>
            <NumberInput label="Sum" name="amount" min="0"/>
            <NumberInput label="Målkonto" name="toAccountId" min="0"/>
        </Form>
        <br />
        <h3>Utbetaling</h3>
        <Form refreshOnSuccess={true} submitText="Utbetal" action={bindParams(createPayout, { accountId: account.id })}>
            <NumberInput label="Sum" name="amount" min="0"/>
        </Form>
        <br />
        <h3>Transaksjoner</h3>
        <p><Link href="account/transactions">Se alle transaksjoner -&gt;</Link></p>
        <br />
        <h3>Betalingsalternativer</h3>
        <TextInput label="Kortnummer" name="cardnumber"/>
        <Button>Legg til kort (TODO)</Button>
        <p>VIPPS (TODO)</p>
    </div>
}