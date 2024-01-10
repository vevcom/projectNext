'use client'

import { ActionReturn, Page, ReadPageInput } from '@/actions/type'
import React, { createContext, useReducer, useRef, useEffect, useState } from 'react'
import type { Context as ReactContextType } from 'react'

export type StateTypes<Data, PageSize extends number> = {
    page: Page<PageSize>,
    data: Data[],
    allLoaded: boolean,
    loading: boolean,
}

export type PagingContextType<Data, PageSize extends number> = ReactContextType<{
    state: StateTypes<Data, PageSize>,
    loadMore: () => Promise<Data[]>,
    refetch: () => Promise<Data[]>,
} | null>

export type PropTypes<PageSize extends number, FetcherDetails> = {
    startPage: Page<PageSize>,
    children: React.ReactNode,
    details: FetcherDetails,
}

export type GeneratorPropTypes<Data, PageSize extends number, FetcherDetails> = {
    fetcher: (x: ReadPageInput<PageSize, FetcherDetails>) => Promise<ActionReturn<Data[]>>,
    Context: PagingContextType<Data, PageSize>,
}

type ActionTypes<Data, PageSize extends number> = {
    type: 'loadMoreStart',
} | {
    type: 'loadMoreSuccess' | 'loadMoreFailure',
    fetchReturn: ActionReturn<Data[]>,
} | {
    type: 'clearAll',
    startPage: Page<PageSize>,
}

function endlessScrollReducer<Data, const PageSize extends number>(state: StateTypes<Data, PageSize>, action: ActionTypes<Data, PageSize>) : StateTypes<Data, PageSize> {
    switch (action.type) {
        case 'loadMoreStart':
            return { ...state, loading: true }
        case 'loadMoreSuccess':
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
            console.error(action.fetchReturn.error)
            return { ...state, allLoaded: true, loading: false }
        case 'clearAll':
            return { ...state, data: [], page: action.startPage, allLoaded: false }
        default:
            return state
    }
}

function generatePagingProvider<Data, PageSize extends number, FetcherDetails>({ fetcher, Context }: GeneratorPropTypes<Data, PageSize, FetcherDetails>) {
    return function PagingProvider({ startPage, children, details }: PropTypes< PageSize, FetcherDetails>) {
        const [state, dispatch] = useReducer(endlessScrollReducer<Data, PageSize>, { data: [], page: startPage, loading: false, allLoaded: false })

        const stateRef = useRef(state)
        const detailsRef = useRef(details)
        useEffect(() => {
            dispatch({ type: 'clearAll', startPage: startPage })
            detailsRef.current = details
        }, [details])

        stateRef.current = state
        useEffect(() => {
            stateRef.current = state
        }, [state])

        const loadMore = async () => {
            if (stateRef.current.loading || stateRef.current.allLoaded) return []
            dispatch({ type: 'loadMoreStart' })

            const fetchReturn = await fetcher({
                page: stateRef.current.page,
                details: detailsRef.current,
            })
            if (!fetchReturn.success || !fetchReturn.data) {
                dispatch({ type: 'loadMoreFailure', fetchReturn })
            } else {
                dispatch({ type: 'loadMoreSuccess', fetchReturn })
            }
            return fetchReturn.data || []
        }

        const refetch = async () => {
            const goToPage = stateRef.current.page.page
            dispatch({ type: 'clearAll', startPage: startPage  })
            const data : Data[] = []
            while (stateRef.current.page.page < goToPage) {
                const newData = await loadMore()
                data.push(...newData)
            }
            return data
        }

        return (
            <Context.Provider value={{ state, loadMore, refetch }}>
                {children}
            </Context.Provider>
        )
    }
}
function generatePagingContext<Data, const PageSize extends number>()
: PagingContextType<Data, PageSize> {
    const context = createContext<{
        state: StateTypes<Data, PageSize>,
        loadMore:() => Promise<Data[]>,
        refetch: () => Promise<Data[]>,
            } | null>(null)
    return context
}

export default generatePagingProvider
export { generatePagingContext }
