'use client'

import React, { createContext, useState, useRef, useEffect } from 'react'
import type { ActionReturn, Page, ReadPageInput } from '@/actions/Types'
import type { Context as ReactContextType } from 'react'

export type StateTypes<Data, Cursor, PageSize extends number> = {
    page: Page<PageSize, Cursor>,
    data: Data[],
    allLoaded: boolean,
}

export type PagingContextType<Data, Cursor, PageSize extends number, FetcherDetails> = ReactContextType<{
    state: StateTypes<Data, Cursor, PageSize>,
    loadMore: () => Promise<Data[]>,
    refetch: () => Promise<Data[]>,
    setDetails: (details: FetcherDetails, withFetch?: boolean) => void,
    serverRenderedData: Data[],
    startPage: Omit<Page<PageSize, Cursor>, 'cursor'>,
    loading: boolean,
    deatils: FetcherDetails,
} | null>

export type PropTypes<Data, Cursor, PageSize extends number, FetcherDetails> = {
    startPage: Omit<Page<PageSize, Cursor>, 'cursor'>,
    children: React.ReactNode,
    details: FetcherDetails,
    serverRenderedData: Data[],
}

export type GeneratorPropTypes<Data, Cursor, PageSize extends number, FetcherDetails, DataGuarantee extends boolean> = {
    fetcher: (x: ReadPageInput<PageSize, Cursor, FetcherDetails>) => Promise<ActionReturn<Data[], DataGuarantee>>,
    Context: PagingContextType<Data, Cursor, PageSize, FetcherDetails>,
    getCursorAfterFetch: (data: Data[]) => Cursor | null,
}

/**
 * Generates a paging provider. Should be used in conjunction with generatePagingContext.
 * @param fetcher The fetcher function that fetches the data.
 * @param Context The context to use.
 * @param getCursorAfterFetch A function that returns the cursor after fetching the data. You need
 * to provide the way to set the next cursor after fetching the data. A return of null is interpreted as
 * no data returned at all. In this case, the cursor will be unchanged.
 * @returns A react component that provides the paging context.
 */
function generatePagingProvider<Data, Cursor, PageSize extends number, FetcherDetails, DataGuarantee extends boolean>({
    fetcher,
    Context,
    getCursorAfterFetch,
}: GeneratorPropTypes<Data, Cursor, PageSize, FetcherDetails, DataGuarantee>
) {
    return function PagingProvider(
        { serverRenderedData, startPage, children, details: givenDetails }: PropTypes<Data, Cursor, PageSize, FetcherDetails>
    ) {
        const generateDefaultState = () => {
            const cursor = getCursorAfterFetch(serverRenderedData)
            const page : Page<PageSize, Cursor> = cursor ? {
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
        const [state, setState_] = useState<StateTypes<Data, Cursor, PageSize>>(
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
        const setState = (newState: StateTypes<Data, Cursor, PageSize>) => {
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
                page: stateRef.current.page,
                details: details.current
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
            const newPage : Page<PageSize, Cursor> = newCursor ? {
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
                allLoaded: newCursor ? false : true,
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
                deatils: { ...details.current },
            }}>
                {children}
            </Context.Provider>
        )
    }
}
function generatePagingContext<
    Data,
    Cursor,
    const PageSize extends number,
    FetcherDetails = undefined
>(): PagingContextType<
    Data,
    Cursor,
    PageSize,
    FetcherDetails
    > {
    const context = createContext<{
        state: StateTypes<Data, Cursor, PageSize>,
        loadMore: () => Promise<Data[]>,
        refetch: () => Promise<Data[]>,
        setDetails: (details: FetcherDetails, withFetch?: boolean) => void,
        serverRenderedData: Data[],
        startPage: Omit<Page<PageSize, Cursor>, 'cursor'>,
        loading: boolean,
        deatils: FetcherDetails,
            } | null>(null)
    return context
}

export default generatePagingProvider
export { generatePagingContext }
