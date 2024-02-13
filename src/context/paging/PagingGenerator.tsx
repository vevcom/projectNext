'use client'

import React, { createContext, useState, useRef, useEffect } from 'react'
import type { ActionReturn, Page, ReadPageInput } from '@/actions/type'
import type { Context as ReactContextType } from 'react'
import { set } from 'zod'

export type StateTypes<Data, PageSize extends number> = {
    page: Page<PageSize>,
    data: Data[],
    allLoaded: boolean,
    loading: boolean,
}

export type PagingContextType<Data, PageSize extends number, FetcherDetails> = ReactContextType<{
    state: StateTypes<Data, PageSize>,
    loadMore: () => Promise<Data[]>,
    refetch: () => Promise<Data[]>,
    setDetails: (details: FetcherDetails) => void,
    serverRenderedData: Data[],
} | null>

export type PropTypes<Data, PageSize extends number, FetcherDetails> = {
    startPage: Page<PageSize>,
    children: React.ReactNode,
    details: FetcherDetails,
    serverRenderedData: Data[],
}

export type GeneratorPropTypes<Data, PageSize extends number, FetcherDetails, DataGuarantee extends boolean> = {
    fetcher: (x: ReadPageInput<PageSize, FetcherDetails>) => Promise<ActionReturn<Data[], DataGuarantee>>,
    Context: PagingContextType<Data, PageSize, FetcherDetails>,
}

type ActionTypes<Data, PageSize extends number, DataGuarantee extends boolean> = {
    type: 'loadMoreStart',
} | {
    type: 'loadMoreSuccess' | 'loadMoreFailure',
    fetchReturn: ActionReturn<Data[], DataGuarantee>,
} | {
    type: 'clearAll',
    startPage: Page<PageSize>,
    serverRenderedData: Data[],
}

function fetchReducer<Data, const PageSize extends number, DataGuarantee extends boolean>(
    state: StateTypes<Data, PageSize>,
    action: ActionTypes<Data, PageSize, DataGuarantee>
): StateTypes<Data, PageSize> {
    switch (action.type) {
        case 'loadMoreStart':
            return { ...state, loading: true }
        case 'loadMoreSuccess':
            if (!action.fetchReturn.success) throw new Error('loadMoreSuccess called with unsuccessful fetchReturn')
            if (!action.fetchReturn.data || action.fetchReturn.data.length === 0) {
                return { ...state, allLoaded: true, loading: false }
            }
            return {
                ...state,
                data: [...state.data, ...action.fetchReturn.data],
                loading: false,
                page: {
                    ...state.page,
                    page: state.page.page + 1,
                }
            }
        case 'loadMoreFailure':
            return { ...state, allLoaded: true, loading: false }
        default:
            return state
    }
}

function generatePagingProvider<Data, PageSize extends number, FetcherDetails, DataGuarantee extends boolean>({
    fetcher,
    Context
}: GeneratorPropTypes<Data, PageSize, FetcherDetails, DataGuarantee>
) {
    return function PagingProvider(
        { serverRenderedData, startPage, children, details:givenDetails }: PropTypes<Data, PageSize, FetcherDetails>
    ) {
        const [state, setState] = useState(
            {
                data: serverRenderedData,
                page: startPage,
                loading: false,
                allLoaded: false
            }
        )

        const stateRef = useRef(state)
        const detailsRef = useRef(givenDetails)
        const setDetails = (details: FetcherDetails) => {
            setState({ ...state, data: [], page: startPage, allLoaded: false })
            detailsRef.current = details
        }
        useEffect(() => setDetails(givenDetails), [givenDetails])

        stateRef.current = state
        useEffect(() => {
            stateRef.current = state
        }, [state])

        const loadMore = async () => {
            if (stateRef.current.loading || stateRef.current.allLoaded) return []
            setState({ ...state, loading: true })

            const fetchReturn = await fetcher({
                page: stateRef.current.page,
                details: detailsRef.current,
            })
            if (!fetchReturn.success) {
                setState({ ...state, allLoaded: true, loading: false })
                return []
            }
            if (!fetchReturn.data || fetchReturn.data.length === 0) {
                setState({ ...state, allLoaded: true, loading: false })
                return []
            }
            setState({
                ...state,
                data: [...state.data, ...fetchReturn.data],
                loading: false,
                page: {
                    ...state.page,
                    page: state.page.page + 1,
                }
            })
            return fetchReturn.data || []
        }

        const refetch = async () => {
            const goToPage = stateRef.current.page.page
            setState({ ...state, data: [], page: startPage, allLoaded: false })
            const data: Data[] = []
            while (stateRef.current.page.page < goToPage) {
                const newData = await loadMore()
                data.push(...newData)
            }
            return data
        }

        return (
            <Context.Provider value={{ state, loadMore, refetch, serverRenderedData, setDetails }}>
                {children}
            </Context.Provider>
        )
    }
}
function generatePagingContext<Data, const PageSize extends number, FetcherDetails = undefined>(): PagingContextType<Data, PageSize, FetcherDetails> {
    const context = createContext<{
        state: StateTypes<Data, PageSize>,
        loadMore: () => Promise<Data[]>,
        refetch: () => Promise<Data[]>,
        setDetails: (details: FetcherDetails) => void,
        serverRenderedData: Data[],
            } | null>(null)
    return context
}

export default generatePagingProvider
export { generatePagingContext }
