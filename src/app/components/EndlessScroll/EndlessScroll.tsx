'use client'

import { ActionReturn, Page } from '@/actions/type'
import React, { createContext, useReducer } from 'react'
import type { Context } from 'react'

type ContextType<Data, PageSize extends number> = Context<{
    state: StateTypes<Data, PageSize>,
    loadMore: () => Promise<void>,
} | null>

export type PropTypes<Data, PageSize extends number> = {
    fetcher: (page: Page<PageSize>) => Promise<ActionReturn<Data[]>>,
    initialData: Data[],
    startPage: Page<PageSize>,
    children: React.ReactNode,
    Context: ContextType<Data, PageSize>,
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

function endlessScrollReducer<Data, const PageSize extends number>
(state: StateTypes<Data, PageSize>, action: ActionTypes<Data>) : StateTypes<Data, PageSize> {
    switch (action.type) {
        case 'loadMoreStart':
            return { ...state, loading: true };
        case 'loadMoreSuccess':
            if (!action.fetchReturn.data || action.fetchReturn.data.length === 0) {
                return {...state, allLoaded: true, loading: false}
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
            console.error(action.fetchReturn.error);
            return {...state, allLoaded: true, loading: false}
    }
}

export default function EndlessScroll<Data, const PageSize extends number>
    ({ fetcher, initialData, startPage, children, Context }: PropTypes<Data, PageSize>) {
    const [state, dispatch] = useReducer(endlessScrollReducer<Data, PageSize>, { data: initialData, page: startPage, loading: false, allLoaded: false });

    const loadMore = async () => {
        dispatch({ type: 'loadMoreStart' });
        const fetchReturn = await fetcher(state.page)
        if (!fetchReturn.success || !fetchReturn.data) {
            dispatch({ type: 'loadMoreFailure', fetchReturn });
        } else {
            dispatch({ type: 'loadMoreSuccess', fetchReturn });
        }
    }

    return (
        <Context.Provider value={{ state , loadMore }}>
            {children}
        </Context.Provider>
    );
}

export function createEndlessScrollContext<Data, const PageSize extends number>() : ContextType<Data, PageSize> {
    return createContext<{
        state: StateTypes<Data, PageSize>,
        loadMore: () => Promise<void>,
    } | null>(null)
}