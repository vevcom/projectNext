import { LedgerAccountMethods } from '@/services/ledger/ledgerAccount/methods'
import { LedgerTransactionMethods } from '@/services/ledger/ledgerTransactions/methods'
import { ManualTransferMethods } from '@/services/ledger/manualTransfers/methods'
import { UserMethods } from '@/services/users/methods'
import { beforeAll, beforeEach, afterEach, describe, expect, test } from '@jest/globals'
import { allSettledOrThrow } from 'tests/utils'

const TEST_ACCOUNT_COUNT = 3
const INITIAL_BALANCE = { amount: 100_00, fees: 10_00 }

describe('ledger transactions', () => {
    let testAccountIds: number[] = []

    // Set up ledger accounts
    beforeAll(async () => {
        // TODO: Create utility to create test accounts
        await allSettledOrThrow(Array.from({ length: TEST_ACCOUNT_COUNT }).map(async (_, i) => {
            const username = `testuser${i + 1}`
            
            const testUser = await UserMethods.create({
                data: {
                    email: username + '@example.com',
                    firstname: 'Test',
                    lastname: 'User',
                    username,
                },
                bypassAuth: true,
            })

            const testAccount = await LedgerAccountMethods.create({
                data: {
                    userId: testUser.id,
                },
                bypassAuth: true,
            })

            testAccountIds.push(testAccount.id)
        }))
    })

    afterEach(async () => {
        await prisma.ledgerEntry.deleteMany({})
        await prisma.ledgerTransaction.deleteMany({})
    })
    
    describe('external transactions', () => {

    })

    describe('internal transactions', () => {
        beforeEach(async () => {
            await allSettledOrThrow(testAccountIds.map(async accountId => {
                    const manualTransfer = await ManualTransferMethods.create({
                        params: {
                            amount: INITIAL_BALANCE.amount,
                            fees: INITIAL_BALANCE.fees,
                        },
                    })

                    await LedgerTransactionMethods.create({
                        params: {
                            purpose: 'DEPOSIT',
                            ledgerEntries: [{
                                ledgerAccountId: accountId,
                                amount: INITIAL_BALANCE.amount,
                            }],
                            manualTransferId: manualTransfer.id,
                        }
                    })
                })
            )
        })

        const validLedgerEntries: number[][] = [
            // No entries
            [],
            // Transfer between two accounts
            [100_00, -100_00],
            // Transfer between three accounts - two debits and one credit
            [100_00, -50_00, -50_00],
            // Transfer between three accounts - two credits and one debit
            [-100_00, 50_00, 50_00],
        ]

        test.each(validLedgerEntries)('valid internal transactions', async (...entries) => {
            const transaction = await LedgerTransactionMethods.create({
                params: {
                    ledgerEntries: entries.map((amount, i) => ({ amount, ledgerAccountId: testAccountIds[i] })),
                    purpose: 'DEPOSIT',
                },
            })

            expect(transaction).toMatchObject({
                state: 'SUCCEEDED',
            })

            const balances = await LedgerAccountMethods.calculateBalances({
                params: { ids: testAccountIds },
            })

            entries.forEach((amount, i) => {
                const accountId = testAccountIds[i]
                const balance = balances[accountId]

                expect(balance.amount).toBe(INITIAL_BALANCE.amount + amount)
            })
        })

        const invalidLedgerEntries: number[][] = [
            // Only one entry
            [100],
            [-100],
            // Non-zero sum
            [100_00, -99_00],
            [-1919, 1000_00],
            [100_00, -50_00, -50_01],
        ]

        test.each(invalidLedgerEntries)('invalid internal transactions', async (...entries) => {
            const transactionPromise = LedgerTransactionMethods.create({
                params: {
                    ledgerEntries: entries.map((amount, i) => ({ amount, ledgerAccountId: testAccountIds[i] })),
                    purpose: 'DEPOSIT',
                },
            })

            await expect(transactionPromise).rejects.toThrow()

            const balances = await LedgerAccountMethods.calculateBalances({
                params: { ids: testAccountIds },
            })

            testAccountIds.forEach(accountId => {
                const balance = balances[accountId]

                expect(balance.amount).toBe(INITIAL_BALANCE.amount)
            })
        })
    })
})
