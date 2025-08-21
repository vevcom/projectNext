import { ManualTransfer, Payment } from "@prisma/client"
import { BalanceRecord } from "@/services/ledger/ledgerAccount/Types"

/** 
 * Calculates fees proportional to the ratio between `entryAmount` and `totalAmount`.
 * 
 * **Example:** Say an account has amount = 100 Kl.M. and fees = 20 Kl.M.
 * Deducting 25 Kl.M. is 25% of the total amount, so the fees deducted
 * should also be 25% of the total fees, i.e., 5 Kl.M.
 */
export function feesFormula(entryAmount: number, totalAmount: number, totalFees: number) {
    if (entryAmount === 0 || totalAmount === 0) return 0;

    let fees = Math.trunc(totalFees * entryAmount / totalAmount);

    // Clamp fees to have same sign as amount 
    // and never exceed total fees.
    if (entryAmount > 0) {
        return Math.min(Math.max(fees, 0), totalFees);
    } else {
        return Math.min(Math.max(fees, -totalFees), 0);
    }
}

/**
 * Calculates the fees for debit ledger entries (amount < 0) based on
 * the balances of the accounts which are deducted.
 */
export function calculateDebitFees(ledgerEntries: { amount: number, ledgerAccountId: number }[], balances: BalanceRecord) {
    const debitLedgerEntries = ledgerEntries.filter(entry => entry.amount < 0)

    return Object.fromEntries(debitLedgerEntries.map(entry => { 
        const balance = balances[entry.ledgerAccountId]

        if (!balance) throw Error(`Balance for ledger account nr. ${entry.ledgerAccountId} not provided.`)

        return [entry.ledgerAccountId, feesFormula(entry.amount, balance.amount, balance.fees)]
    }))
}

/**
 * Calculates the fees for credit ledger entries (amount > 0) based on
 * the total amount and total fees of in the transaction.
 */
export function calculateCreditFees(
    ledgerEntries: { amount: number, fees: number | null, ledgerAccountId: number }[],
    payment: Payment | null,
    manualTransfer: ManualTransfer | null
) {
    // If payment is attached but fees are null,
    // return null until it completes.
    if (payment && payment.fees === null) return null
    
    const creditLedgerEntries = ledgerEntries.filter(entry => entry.amount > 0)
    const debitLedgerEntries = ledgerEntries.filter(entry => entry.amount < 0)

    const sum = (...values: (number | null | undefined)[]) =>
        values.reduce<number>((total, value) => total + (value ?? 0), 0)

    let totalAmount = sum(
        ...debitLedgerEntries.map(entry => -entry.amount),
        payment?.amount,
        manualTransfer?.amount,
    )
    let totalFees = sum(
        ...debitLedgerEntries.map(entry => -(entry.fees ?? 0)),
        payment?.fees,
        manualTransfer?.fees,
    )
    
    return Object.fromEntries(creditLedgerEntries.map(entry => {
        const fees = feesFormula(entry.amount, totalAmount, totalFees)

        // Subtract the from the totals to ensure
        // that the sum of all fees ends up exactly 
        // equal to `totalFees`.
        totalAmount -= entry.amount
        totalFees -= fees

        return [entry.ledgerAccountId, fees]
    }))
}