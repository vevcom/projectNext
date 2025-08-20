import { describe, test } from '@jest/globals'

describe('ledger accounts', () => {
    const testEntries = [
        [100_00, [{ amount: 100_00, fees: 10_00 }]],
    ]
    test('balance', () => {
        await prisma.ledgerTransaction.create({
            data: {
                ledgerEntries: {
                    create: [

                    ],
                },
            },
        })
    })
})
