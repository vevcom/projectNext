import { bindParams } from "@/actions/bind"
import { calculateLedgerAccountBalance, readLedgerAccount } from "@/actions/ledger/ledgerAccount"
import { createDeposit } from "@/actions/ledger/transactions/deposits"
import { createPayout } from "@/actions/ledger/transactions/payouts"
import Form from "@/app/_components/Form/Form"
import TextInput from "@/app/_components/UI/TextInput"
import { unwrapActionReturn } from "@/app/redirectToErrorPage"
import { getUser } from "@/auth/getUser"
import Button from "@/components/UI/Button"
import Link from "next/link"

export default async function Account() {
    const transactions = [
        {
            date: '1919-10-10 10:21',
            amount: 100.00,
            description: 'Innskudd'
        },
        {
            date: '1919-10-10 10:10',
            amount: -3.00,
            description: 'Kjøp ved Kioleskabet',
        },
        {
            date: '1919-10-10 10:29',
            amount: -100.00,
            description: 'Betaling for Vårphaest',
        },
    ]

    const session = await getUser({
        userRequired: true,
        shouldRedirect: true,
    }) // TODO: Replace

    
    const account = unwrapActionReturn(await readLedgerAccount({ userId: session.user.id }))
    const balance = unwrapActionReturn(await calculateLedgerAccountBalance({ id: account?.id }))

    return <div>
        <h2>Konto</h2>
        <p>Balanse: <b>{balance}</b> kluengede muent</p>
        <br />
        <h3>Innskudd</h3>
        <Form action={bindParams(createDeposit, { accountId: account.id })}>
            <TextInput label="Sum" name="amount"/>
        </Form>
        <br />
        <h3>Utbetaling</h3>
        <Form action={bindParams(createPayout, { accountId: account.id })}>
            <TextInput label="Sum" name="amount"/>
        </Form>
        <br />
        <h3>Transaksjoner</h3>
        <table>
            <thead>
                <tr>
                    <th>Dato</th>
                    <th>Sum</th>
                    <th>Beskrivese</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((transaction, i) => (
                    <tr key={i}>
                        <td>{transaction.date}</td> 
                        <td align="right"><b>{transaction.amount.toFixed(2)}</b></td>
                        <td>{transaction.description}</td>
                    </tr>
                ))}
            </tbody>
        </table>
        <p><Link href="account/transactions">Se alle transaksjoner</Link></p>
        <br />
        <h3>Betalingsalternativer</h3>
        <TextInput label="Kortnummer" name="cardnumber"/>
        <Button>Legg til kort (TODO)</Button>
        <p>VIPPS (TODO)</p>
    </div>
}