'use client'

import { ActionReturn, Page, ReadPageInput } from '@/actions/type'
import React, { createContext, useReducer, useRef, useEffect } from 'react'
import type { Context } from 'react'

export type PagingContextType<Data, PageSize extends number, FetcherDetails> = Context<{
    state: StateTypes<Data, PageSize>,
    loadMore: (details: FetcherDetails) => Promise<Data[]>,
} | null>

export type PropTypes<Data, PageSize extends number> = {
    initialData: Data[],
    startPage: Page<PageSize>,
    children: React.ReactNode,
}

export type GeneratorPropTypes<Data, PageSize extends number, FetcherDetails> = {
    fetcher: (x: ReadPageInput<PageSize, FetcherDetails>) => Promise<ActionReturn<Data[]>>,
    Context: PagingContextType<Data, PageSize, FetcherDetails>,
}

export type StateTypes<Data, PageSize extends number> = {
    page: Page<PageSize>,
    data: Data[],
    allLoaded: boolean,
    loading: boolean,
}

type ActionTypes<Data> = {
    type: 'loadMoreStart'
} | {
    type: 'loadMoreSuccess' | 'loadMoreFailure',
    fetchReturn: ActionReturn<Data[]>,
}

function endlessScrollReducer<Data, const PageSize extends number>(state: StateTypes<Data, PageSize>, action: ActionTypes<Data>) : StateTypes<Data, PageSize> {
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
    }
}

const generatePagingProvider = <Data, PageSize extends number, FetcherDetails>({ fetcher, Context }: GeneratorPropTypes<Data, PageSize, FetcherDetails>) =>
    ({ initialData, startPage, children }: PropTypes<Data, PageSize>) => {
        const [state, dispatch] = useReducer(endlessScrollReducer<Data, PageSize>, { data: initialData, page: startPage, loading: false, allLoaded: false })

        const stateRef = useRef(state)
        stateRef.current = state
        useEffect(() => {
            stateRef.current = state
        }, [state])

        const loadMore = async (details: FetcherDetails) => {
            if (stateRef.current.loading || stateRef.current.allLoaded) return []
            dispatch({ type: 'loadMoreStart' })

            const fetchReturn = await fetcher({
                page: stateRef.current.page,
                details,
            })
            if (!fetchReturn.success || !fetchReturn.data) {
                dispatch({ type: 'loadMoreFailure', fetchReturn })
            } else {
                dispatch({ type: 'loadMoreSuccess', fetchReturn })
            }
            return fetchReturn.data || []
        }
        return (
            <Context.Provider value={{ state, loadMore }}>
                {children}
            </Context.Provider>
        )
    }


function generatePagingContext<Data, const PageSize extends number, FetcherDetails>() : PagingContextType<Data, PageSize, FetcherDetails> {
    const context = createContext<{
        state: StateTypes<Data, PageSize>,
        loadMore:(details: FetcherDetails) => Promise<Data[]>,
            } | null>(null)
    return context
}

export default generatePagingProvider
export { generatePagingContext }
