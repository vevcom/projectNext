'use client'

import { generatePaging } from './PagingGenerator'
import { readLedgerAccountPageAction } from '@/services/ledger/accounts/actions'
import type { LedgerAccount, LedgerAccountType } from '@/prisma-generated-pn-types'
import type { Balance } from '@/services/ledger/accounts/types'

export type PageSizeTransactions = 10

export const [LedgerAccountPagingContext, LedgerAccountPagingProvider] = generatePaging<
    LedgerAccount & { balance: Balance },
    { id: number },
    PageSizeTransactions,
    { accountType?: LedgerAccountType }
>({
    fetcher: (paging) => readLedgerAccountPageAction({ params: paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id })
})
