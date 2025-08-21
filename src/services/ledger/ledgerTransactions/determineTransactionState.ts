import { LedgerTransactionStatus, PaymentStatus } from "@prisma/client"
import { ExpandedLedgerTransaction } from "./Type"
import { BalanceRecord } from "@/services/ledger/ledgerAccount/Types"

type LedgerTransactionTransition = {
    state: LedgerTransactionStatus,
    reason?: string,
}

type LedgerTransactionRule = (transaction: ExpandedLedgerTransaction, balances: BalanceRecord) => LedgerTransactionTransition | undefined

/**
 * Determines the state of a given transaction.
 */
export async function determineTransactionState(transaction: ExpandedLedgerTransaction, balances: BalanceRecord): Promise<LedgerTransactionTransition> {
    // NOTE: The order of the rules are important!
    // Fee checks must run only after payment completes
    // since fees aren't set earlier.
    const rules: LedgerTransactionRule[] = [
        noTerminalState,
        noFailedPayment,
        amountAndFeesHaveSameSigns,
        validAmountSum,
        sufficientBalances,
        paymentComplete,
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
function noTerminalState({ status }: ExpandedLedgerTransaction): LedgerTransactionTransition | undefined {
    if (status !== 'PENDING') return { state: status }
}

/**
 * If any payment has failed, the entire transaction has failed.
 */
function noFailedPayment({ payment }: ExpandedLedgerTransaction): LedgerTransactionTransition | undefined {
    const okStates: PaymentStatus[] = ['PENDING', 'PROCESSING', 'SUCCEEDED']
    const hasFailedPayment = payment && !okStates.includes(payment.status) 

    if (hasFailedPayment) return { state: 'FAILED', reason: 'Betaling mislyktes.' }
}

/**
 * Check that ledger entries, payment and manual transfer have correct signs.
 * 
 * Mathematically: `amount > 0 <=> fees > 0` and `amount < 0 <=> fees < 0`.
 */
function amountAndFeesHaveSameSigns({ ledgerEntries, payment, manualTransfer }: ExpandedLedgerTransaction): LedgerTransactionTransition | undefined {
    // Helper function which return true when a and b have same signs or at least
    // one of a and b are falsy.
    const sameSigns = (a?: number | null, b?: number | null) => !a || !b || Math.sign(a) === Math.sign(b)

    const validPayment        = sameSigns(payment?.amount, payment?.fees)
    const validManualTransfer = sameSigns(manualTransfer?.amount, manualTransfer?.fees)
    const validLedgerEntries  = ledgerEntries.every(entry => sameSigns(entry.amount, entry.fees))
    
    if (!validManualTransfer || !validPayment || !validLedgerEntries) return { state: 'FAILED', reason: 'Ugyldige beløp og/eller gebyrer.' }
}


/**
 * Kirchhoff's first law! The sum of all amounts must be zero.
 * I.e. money must come from somewhere and go to somewhere.
 */
function validAmountSum({ ledgerEntries, payment, manualTransfer }: ExpandedLedgerTransaction): LedgerTransactionTransition | undefined {
    // NOTE: Since the number of entries in a transaction is very low (max two) we can
    // sum the amounts and fees in memory rather than doing a database aggregation.
    const ledgerEntriesAmountSum = ledgerEntries.reduce((sum, entry) => sum + entry.amount, 0)
    const paymentAmount          = payment?.amount ?? 0
    const manualTransferAmount   = manualTransfer?.amount ?? 0

    if (ledgerEntriesAmountSum !== paymentAmount + manualTransferAmount) return { state: 'FAILED', reason: 'Ugyldig sum av beløp.' }
}

/** 
 * If an entry is debit (amount < 0), its referenced account must
 * have a positive balance after the transaction succeeds.
 */
function sufficientBalances({ ledgerEntries }: ExpandedLedgerTransaction, balances: BalanceRecord): LedgerTransactionTransition | undefined {
    const debitLedgerAccountIds = ledgerEntries.filter(entry => entry.amount < 0).map(entry => entry.ledgerAccountId)
    const debitBalances = debitLedgerAccountIds.map(id => balances[id])
    
    if (debitBalances.some(balance => !balance)) {
        throw new Error("Missing balance in balance record.")
    }

    const hasNegativeBalance = debitBalances.some(balance => balance.amount < 0 || balance.fees < 0)

    if (hasNegativeBalance) return { state: 'FAILED', reason: 'Ikke nok midler for å utføre transaksjonen.' }
}

/**
 * If any payment is pending, the transaction is pending.
 */
function paymentComplete({ payment }: ExpandedLedgerTransaction): LedgerTransactionTransition | undefined {
    // Since we have checked for failure states above,
    // we can simply check that the transaction has not succeeded.
    const hasPendingPayment = payment && payment.status !== 'SUCCEEDED'

    if (hasPendingPayment) return { state: 'PENDING' }
}

/**
 * All fees must be non-null.
 */
function noNullFees({ ledgerEntries, payment, manualTransfer }: ExpandedLedgerTransaction): LedgerTransactionTransition | undefined {
    const hasNullFees = 
        ledgerEntries.some(entry => entry.fees === null) ||
        payment && payment.fees === null ||
        manualTransfer && manualTransfer.fees === null

    if (hasNullFees) return { state: 'FAILED', reason: 'Manglende gebyrer.' }
}

/**
 * Fees must also follow Kirchhoff's first law.
 */
function validFeesSum({ ledgerEntries, payment, manualTransfer }: ExpandedLedgerTransaction): LedgerTransactionTransition | undefined {
    // NOTE: Since the number of entries in a transaction is very low (max two) we can
    // sum the amounts and fees in memory rather than doing a database aggregation.
    const ledgerEntriesFeesSum = ledgerEntries.reduce((sum, entry) => sum + entry.fees!, 0)
    const paymentFees          = payment?.fees ?? 0
    const manualTransferFees   = manualTransfer?.fees ?? 0

    if (ledgerEntriesFeesSum !== paymentFees + manualTransferFees) return { state: 'FAILED', reason: 'Ugyldig sum av gebyrer.' }
}
