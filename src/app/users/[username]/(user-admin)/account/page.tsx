// import { readLedgerAccount } from '@/actions/ledger/ledgerAccount'
import Card from './Card'
import BankCardModal from './BankCardModal'
import LedgerAccountBalance from '@/app/_components/Ledger/LedgerAccountBalance'
import TextInput from '@/app/_components/UI/TextInput'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { getUser } from '@/auth/getUser'
import Button from '@/components/UI/Button'
import DepositModal from '@/components/Ledger/DepositModal'
import PayoutModal from '@/components/Ledger/PayoutModal'
import { calculateLedgerAccountBalanceAction } from '@/services/ledger/ledgerAccount/actions'
import Link from 'next/link'

export default async function Account() {
    const session = await getUser({
        userRequired: true,
        shouldRedirect: true,
    }) // TODO: Replace

    const account = { id: 1 } //unwrapActionReturn(await readLedgerAccount({ userId: session.user.id }))

    const balance = unwrapActionReturn(await calculateLedgerAccountBalanceAction({ id }))

    return <div>
        <Card>
            <h2>Kontooversikt</h2>
            <p>Saldo: <strong>69</strong> Kluengende Muente</p>
            <p><em>Avgifter: <strong>69</strong> Kluengende Muente</em></p>
            <DepositModal ledgerAccountId={1} />
            <PayoutModal ledgerAccountId={1} />
            {/* <h2>Konto</h2> */}
            {/* <LedgerAccountBalance accountId={account.id} showFees /> */}
            <br></br>
            {/* <CheckoutModal title='Sett inn'/> */}
            {/* <PayoutModal accountId={account.id} /> */}
        </Card>
        {/* <PopUp
                PopUpKey="DepositForm"
                customShowButton={(open) => <Button onClick={open}>Sett inn muenter</Button>}
            >
                <h3>Sett inn muenter</h3>
                <DepositForm accountId={account.id}/>
            </PopUp> */}

        {/* <Button>Sett inn muenter</Button> */}
        {/* <h3>Innskudd</h3>
        <br /> */}
        {/* <h3>Betaling</h3>
        <Form
            refreshOnSuccess={true}
            submitText="Sett inn"
            action={bindParams(createPayment, { fromAccountId: account.id })}
        >
            <NumberInput label="Sum" name="amount" min="0"/>
            <NumberInput label="Målkonto" name="toAccountId" min="0"/>
        </Form>
        <br />
        <h3>Utbetaling</h3>
        <Form
            refreshOnSuccess={true}
            submitText="Utbetal"
            action={bindParams(createPayout, { accountId: account.id })}
        >
            <NumberInput label="Sum" name="amount" min="0"/>
        </Form>
        <br /> */}
        <Card>
            <h2>Betalingsalternativer</h2>
            <h3>Bankkort</h3>
            <p>
                Du kan lagre kortinformasjonen din for senere betalinger.
                Kortinformasjonen lagres kun hos betalingsleverandøren vår Stripe, ikke på våre tjenere.
            </p>
            <BankCardModal userId={session.user.id} />
            <h3>NTNU-kort</h3>
            <p>
                For å benytte Kioleskabet på Lophtet må et NTNU-kort være tilknyttet brukeren din.
            </p>
            <Link href="settings">Gå til siden for kortregistrering.</Link>
        </Card>
        <Card>
            <h3>Transaksjoner</h3>
            <table>
                <tbody>
                    <tr>
                        <td>En transaksjon</td>
                    </tr>
                    <tr>
                        <td>En annen transaksjon</td>
                    </tr>
                </tbody>
            </table>
            <p><Link href="account/transactions">Se alle transaksjoner -&gt;</Link></p>
        </Card>
    </div>
}
