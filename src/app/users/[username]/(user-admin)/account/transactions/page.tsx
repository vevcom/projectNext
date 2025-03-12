"use client"

import { readLedgerAccount } from "@/actions/ledger/ledgerAccount"
import EndlessScroll from "@/app/_components/PagingWrappers/EndlessScroll"
import { getUser } from "@/auth/getUser"
import { useUser } from "@/auth/useUser"
import TransactionPagingProvider, { TransactionPagingContext } from "@/contexts/paging/TranasctionPaging"
import { useContext, useEffect, useState } from "react"

export default function Transactions() {
    // const transactionPagingContext = useContext(TransactionPagingContext)

    // if (!transactionPagingContext) {
    //     throw new Error('fuck')
    // }

    const accountId = 2

    return (
        <table>
            <thead>
                <tr>
                    <th>Dato</th>
                    <th>Sum</th>
                    <th>Beskrivelse</th>
                </tr>
            </thead>
            <TransactionPagingProvider startPage={{ page: 0, pageSize: 10 }} details={{ accountId }} serverRenderedData={[]}>
                
                <EndlessScroll
                    pagingContext={TransactionPagingContext}
                    renderer={(transaction) => <tr>
                        <td>{transaction.createdAt.toLocaleString()}</td>
                        <td align="right"><b>{(transaction.toAccountId === accountId ? transaction.amount : -transaction.amount).toFixed(2)}</b></td>
                        <td>{transaction.transactionType}</td>
                    </tr>}
                />
                {/* {
                    transactionPagingContext?.state.data.map((transaction) => 
                        <tr>
                            <td>{transaction.createdAt.toDateString()}</td>
                            <td><b>{transaction.amount}</b></td>
                            <td>{transaction.transactionType}</td>
                        </tr>
                    )
                } */}
            </TransactionPagingProvider>
        </table>
    )
}