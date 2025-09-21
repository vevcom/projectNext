import type { ExpandedLedgerTransaction } from './Type'
import type { BalanceRecord } from '@/services/ledger/ledgerAccount/Types'
import type { LedgerTransactionState, PaymentState } from '@prisma/client'

type LedgerTransactionTransition = {
    state: LedgerTransactionState,
    reason?: string,
}

type LedgerTransactionRule = (
    transaction: ExpandedLedgerTransaction,
    balances: BalanceRecord,
) => LedgerTransactionTransition | null

/**
 * Determines the state of a given transaction.
 */
export async function determineTransactionState(
    transaction: ExpandedLedgerTransaction,
    balances: BalanceRecord,
): Promise<LedgerTransactionTransition> {
    // NOTE: The order of the rules are important!
    // Fee checks must run only after payment completes
    // since fees aren't set earlier.
    const rules: LedgerTransactionRule[] = [
        noTerminalState,
        noFailedTransfer,
        amountAndFeesHaveSameSigns,
        validAmountSum,
        sufficientBalances,
        transfersComplete,
        noNullFees,
        validFeesSum,
    ]

    for (const rule of rules) {
        const state = rule(transaction, balances)

        if (state) return state
    }

    return { state: 'SUCCEEDED' }
}

/**
 * A transaction in a terminal state (SUCCEEDED, FAILED or CANCELED)
 * can never change state.
 */
function noTerminalState(
    { state }: ExpandedLedgerTransaction
): LedgerTransactionTransition | null {
    if (state !== 'PENDING') return { state }

    return null
}

/**
 * If any payment has failed, the entire transaction has failed.
 */
function noFailedTransfer(
    { payment }: ExpandedLedgerTransaction
): LedgerTransactionTransition | null {
    const okStates: PaymentState[] = ['PENDING', 'PROCESSING', 'SUCCEEDED']
    const hasFailedTransfer = payment && !okStates.includes(payment.state)

    if (hasFailedTransfer) return { state: 'FAILED', reason: 'Betaling mislyktes.' }

    return null
}

/**
 * Check that ledger entries, payment and manual transfer have correct signs.
 *
 * Mathematically: `amount > 0 <=> fees > 0` and `amount < 0 <=> fees < 0`.
 */
function amountAndFeesHaveSameSigns(
    { ledgerEntries, payment }: ExpandedLedgerTransaction
): LedgerTransactionTransition | null {
    // Helper function which return true when a and b have same signs or at least
    // one of a and b are falsy.
    const sameSigns = (a?: number | null, b?: number | null) => !a || !b || Math.sign(a) === Math.sign(b)

    const validEntries = ledgerEntries.every(entry => sameSigns(entry.funds, entry.fees))
    const validTransfer = !payment || sameSigns(payment.funds, payment.fees)

    if (!validEntries || !validTransfer) return { state: 'FAILED', reason: 'Ugyldige beløp og/eller gebyrer.' }

    return null
}

/**
 * Kirchhoff's first law! The sum of all amounts must be zero.
 * I.e. money must come from somewhere and go to somewhere.
 */
function validAmountSum(
    { ledgerEntries, payment }: ExpandedLedgerTransaction
): LedgerTransactionTransition | null {
    // NOTE: Since the number of entries in a transaction is very low (max two) we can
    // sum the amounts and fees in memory rather than doing a database aggregation.
    const totalLedgerEntryFunds = ledgerEntries.reduce((sum, entry) => sum + entry.funds, 0)
    const paymentFunds = payment?.funds ?? 0

    if (totalLedgerEntryFunds !== paymentFunds) return { state: 'FAILED', reason: 'Ugyldig totalbeløp.' }

    return null
}

/**
 * If an entry is debit (amount < 0), its referenced account must
 * have a positive balance after the transaction succeeds.
 */
function sufficientBalances(
    { ledgerEntries }: ExpandedLedgerTransaction,
    balances: BalanceRecord
): LedgerTransactionTransition | null {
    const debitLedgerAccountIds = ledgerEntries.filter(entry => entry.funds < 0).map(entry => entry.ledgerAccountId)
    const debitBalances = debitLedgerAccountIds.map(id => balances[id])

    if (debitBalances.some(balance => !balance)) {
        throw new Error('Missing balance in balance record.')
    }

    const hasNegativeBalance = debitBalances.some(balance => balance.amount < 0 || balance.fees < 0)

    if (hasNegativeBalance) return { state: 'FAILED', reason: 'Ikke nok midler for å utføre transaksjonen.' }

    return null
}

/**
 * If any payment is pending, the transaction is pending.
 */
function transfersComplete(
    { payment }: ExpandedLedgerTransaction
): LedgerTransactionTransition | null {
    // Since we have checked for failure states above,
    // we can simply check that the transfer has not succeeded.
    const hasPendingTransfer = payment && payment.state !== 'SUCCEEDED'

    if (hasPendingTransfer) return { state: 'PENDING' }

    return null
}

/**
 * All fees must be non-null.
 */
function noNullFees(
    { ledgerEntries, payment }: ExpandedLedgerTransaction
): LedgerTransactionTransition | null {
    const hasNullFees =
        ledgerEntries.some(entry => entry.fees === null) ||
        payment?.fees === null

    if (hasNullFees) return { state: 'FAILED', reason: 'Manglende gebyrer.' }

    return null
}

/**
 * Fees must also follow Kirchhoff's first law.
 */
function validFeesSum(
    { ledgerEntries, payment }: ExpandedLedgerTransaction
): LedgerTransactionTransition | null {
    // NOTE: Since the number of entries in a transaction is very low (max two) we can
    // sum the amounts and fees in memory rather than doing a database aggregation.
    const totalLedgerEntryFees = ledgerEntries.reduce((sum, entry) => sum + entry.fees!, 0)
    const paymentFees = payment?.fees ?? 0

    if (totalLedgerEntryFees !== paymentFees) return { state: 'FAILED', reason: 'Ugyldig sum av gebyrer.' }

    return null
}
