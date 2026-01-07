import { feesFormula } from '@/services/ledger/ledgerTransactions/calculateFees'
import { describe, expect, test } from '@jest/globals'

type FeeInputOutput = [
    {
        entryAmount: number,
        totalAmount: number,
        totalFees: number,
    },
    number
]

describe('ledger entry fees calculation', () => {
    const expectedInputOutput: FeeInputOutput[] = [
        // "Normal" cases
        [{ entryAmount: 100, totalAmount: 100, totalFees: 10 }, 10],
        [{ entryAmount: 50, totalAmount: 100, totalFees: 10 }, 5],
        // Flooring required
        [{ entryAmount: 33, totalAmount: 100, totalFees: 10 }, 3],
        [{ entryAmount: 25, totalAmount: 100, totalFees: 10 }, 2],
        // Zero amount
        [{ entryAmount: 0, totalAmount: 100, totalFees: 10 }, 0],
        // Insufficient balance
        [{ entryAmount: 100, totalAmount: 0, totalFees: 10 }, 0],
        [{ entryAmount: 0, totalAmount: 0, totalFees: 10 }, 0],
        // No fees
        [{ entryAmount: 10, totalAmount: 10, totalFees: 0 }, 0],
        [{ entryAmount: 0, totalAmount: 10, totalFees: 0 }, 0],
        // Exceeding maximum
        [{ entryAmount: 100, totalAmount: 10, totalFees: 9 }, 9],
        [{ entryAmount: 100, totalAmount: 1, totalFees: 8 }, 8],
    ]

    // NOTE: We use `toBeCloseTo` to handle +0 and -0 correctly.
    // Since fees are always integers it has no effect on the precision.

    test.each(expectedInputOutput)('credit ledger entry fees', ({ entryAmount, totalAmount, totalFees }, expectedFees) => {
        const fees = feesFormula(entryAmount, totalAmount, totalFees)
        expect(fees).toBeCloseTo(expectedFees)
    })

    test.each(expectedInputOutput)('debit ledger entry fees', ({ entryAmount, totalAmount, totalFees }, expectedFees) => {
        const fees = feesFormula(-entryAmount, totalAmount, totalFees)
        expect(fees).toBeCloseTo(-expectedFees)
    })
})
