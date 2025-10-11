'use client'

import React, { createContext, useState, useRef, useEffect } from 'react'
import type { ActionReturn } from '@/services/actionTypes'
import type { ReadPageInput, Page } from '@/lib/paging/types'
import type { Context as ReactContextType } from 'react'

export type PagingState<Data, Cursor, PageSize extends number> = {
    page: Page<PageSize, Cursor>,
    data: Data[],
    allLoaded: boolean,
}

export type PagingData<Data, Cursor, PageSize extends number, FetcherDetails> = {
    state: PagingState<Data, Cursor, PageSize>,
    loadMore: () => Promise<Data[]>,
    refetch: () => Promise<Data[]>,
    setDetails: (details: FetcherDetails, withFetch?: boolean) => void,
    serverRenderedData: Data[],
    startPage: Omit<Page<PageSize, Cursor>, 'cursor'>,
    loading: boolean,
    deatils: FetcherDetails,
}

export type PagingContext<Data, Cursor, PageSize extends number, FetcherDetails> =
    ReactContextType<PagingData<Data, Cursor, PageSize, FetcherDetails> | null>

export type PagingProviderProps<Data, Cursor, PageSize extends number, FetcherDetails> = {
    startPage: Omit<Page<PageSize, Cursor>, 'cursor'>,
    children: React.ReactNode,
    details: FetcherDetails,
    serverRenderedData: Data[],
}

export type GeneratePagingProviderProps<Data, Cursor, PageSize extends number, FetcherDetails> = {
    fetcher: ({ paging }: { paging: ReadPageInput<PageSize, Cursor, FetcherDetails> }) => Promise<ActionReturn<Data[]>>,
    getCursor: ({ lastElement, fetchedCount }: { lastElement: Data, fetchedCount: number }) => Cursor,
}

/**
 * Generates a paging provider. Should be used in conjunction with generatePagingContext.
 *
 * Example usage:
 * ```
 * import { generatePaging } from './PagingGenerator'
 * import { readItemsPageAction } from '@/services/items/actions'
 * import type { Item, ItemCursor } from '@/services/items/types'
 *
 * export type PageSizeItems = 20
 *
 * export const [ItemPagingContext, ItemPagingProvider] = generatePaging<
 *     Item,
 *     ItemCursor,
 *     PageSizeItems
 * >({
 *     fetcher: async ({ paging }) => await readItemsPageAction(paging),
 *     getCursor: ({ lastElement }) => ({ id: lastElement.id }),
 * })
 * ```
 *
 * @param fetcher The function that fetches the data.
 * @param getCursor A function that returns the cursor after fetching data.
 * It is provided the last element fetched and the number of elements fetched.
 * In the case no data is fetched the function will not be called and the cursor will be unchanged.
 * @returns A tuple containing the paging context and a react component that provides the paging context.
 */
export function generatePaging<Data, Cursor, PageSize extends number = number, FetcherDetails = undefined>({
    fetcher,
    getCursor,
}: GeneratePagingProviderProps<Data, Cursor, PageSize, FetcherDetails>
) {
    // Wrap `getCursor` to return null if no data is fetched.
    const getCursorAfterFetch = (data: Data[]) => {
        if (!data.length) return null
        return getCursor({ lastElement: data[data.length - 1], fetchedCount: data.length })
    }

    const Context = createContext<PagingData<Data, Cursor, PageSize, FetcherDetails> | null>(null)

    function Provider({
        serverRenderedData,
        startPage,
        children,
        details: givenDetails
    }: PagingProviderProps<Data, Cursor, PageSize, FetcherDetails>) {
        const generateDefaultState = () => {
            const cursor = getCursorAfterFetch(serverRenderedData)
            const page: Page<PageSize, Cursor> = cursor ? {
                ...startPage,
                cursor,
            } : {
                ...startPage,
                page: 0,
                cursor: null,
            }
            return {
                data: serverRenderedData,
                page,
                allLoaded: false
            }
        }
        const [state, setState_] = useState<PagingState<Data, Cursor, PageSize>>(
            generateDefaultState()
        )
        const [loading, setLoading_] = useState(false)
        const loadingRef = useRef(loading)
        const setLoading = (newLoading: boolean) => {
            loadingRef.current = newLoading
            setLoading_(newLoading)
        }


        //Update state if you want to cause a rerender, else update ref.current
        const stateRef = useRef(state)
        const setState = (newState: PagingState<Data, Cursor, PageSize>) => {
            stateRef.current = newState
            setState_(newState)
        }
        const resetState = () => {
            stateRef.current = generateDefaultState()
            loadingRef.current = false
        }

        const details = useRef(givenDetails)

        const loadMore = async () => {
            if (loadingRef.current || stateRef.current.allLoaded) return []
            loadingRef.current = true
            const oldDetails = details.current //if the user changes the details while loading, we should not set the data
            const result = await fetcher({
                paging: {
                    page: stateRef.current.page,
                    details: details.current,
                },
            })
            if (!result.success || !result.data) {
                setState({ ...stateRef.current })
                setLoading(false)
                return []
            }
            if (!result.data.length) {
                setState({ ...stateRef.current, allLoaded: true })
                setLoading(false)
                return []
            }
            // If the details have changed, we should not set the data
            if (oldDetails !== details.current) {
                setLoading(false)
                return []
            }

            if (!result.data.length) {
                const newState = {
                    data: stateRef.current.data,
                    loading: false,
                    allLoaded: true,
                    page: {
                        ...stateRef.current.page,
                    }
                }
                setState(newState)
                setLoading(false)
                return result.data
            }
            const newCursor = getCursorAfterFetch(result.data) ?? stateRef.current.page.cursor
            const newPage: Page<PageSize, Cursor> = newCursor ? {
                ...stateRef.current.page,
                cursor: newCursor,
                page: stateRef.current.page.page + 1
            } : {
                ...stateRef.current.page,
                cursor: null,
                page: 0
            }

            const newState = {
                data: [...stateRef.current.data, ...result.data],
                loading: false,
                allLoaded: !newCursor,
                page: newPage
            }
            setState(newState)
            setLoading(false)
            return result.data
        }
        const refetch = async () => {
            const toPage = stateRef.current.page.page
            resetState()
            let data: Data[] = []
            for (let i = 0; i < toPage; i++) {
                data = [...data, ...(await loadMore())]
            }
            return data
        }

        const setDetails = (newDetails: FetcherDetails, withFetch: boolean = true) => {
            details.current = newDetails
            resetState()
            if (withFetch) {
                loadMore()
            }
        }

        const initialRender = useRef(true)
        useEffect(() => {
            if (initialRender.current) {
                setDetails(givenDetails, false)
                initialRender.current = false
            } else {
                setDetails(givenDetails)
            }
        }, [givenDetails])

        return (
            <Context.Provider value={{
                state,
                loadMore,
                refetch,
                serverRenderedData,
                startPage,
                setDetails,
                loading,
                deatils: details.current,
            }}>
                {children}
            </Context.Provider>
        )
    }

    return [Context, Provider] as const
}
