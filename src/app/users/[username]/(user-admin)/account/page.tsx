import PayoutModal from './PayoutModal'
import DepositModal from './DepositModal'
import EventPaymentModal from './EventPaymentModal'
import LedgerAccountBalance from '@/app/_components/Ledger/LedgerAccountBalance'
import TextInput from '@/app/_components/UI/TextInput'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import { getUser } from '@/auth/getUser'
import Button from '@/components/UI/Button'
import Link from 'next/link'
import { readLedgerAccount } from '@/actions/ledger/ledgerAccount'

export default async function Account() {
    const session = await getUser({
        userRequired: true,
        shouldRedirect: true,
    }) // TODO: Replace

    const account = unwrapActionReturn(await readLedgerAccount({ userId: session.user.id }))

    return <div>
        <h2>Konto</h2>
        <LedgerAccountBalance accountId={account.id} showFees />
        <DepositModal/>
        <PayoutModal accountId={account.id} />
        <EventPaymentModal />
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
        <h3>Betalingskort</h3>
        <p>For lagre informasjonen din for senere betalinger med Stripe, fyll inn skjemaet under.</p>
        <form>
            <TextInput label="Kortnummer" name="cardnumber"/>
            <Button>Legg til kort</Button>
        </form>
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
        <p></p>
        <br />
    </div>
}
