'use client'

import React, { createContext, useState, useRef, useEffect } from 'react'
import type { ActionReturn, Page, ReadPageInput } from '@/actions/type'
import type { Context as ReactContextType } from 'react'
import { set } from 'zod'

export type StateTypes<Data, PageSize extends number> = {
    page: Page<PageSize>,
    data: Data[],
    allLoaded: boolean,
}

export type PagingContextType<Data, PageSize extends number, FetcherDetails> = ReactContextType<{
    state: StateTypes<Data, PageSize>,
    loadMore: () => Promise<Data[]>,
    refetch: () => Promise<Data[]>,
    setDetails: (details: FetcherDetails, withFetch?: boolean) => void,
    serverRenderedData: Data[],
    startPage: Page<PageSize>,
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

function generatePagingProvider<Data, PageSize extends number, FetcherDetails, DataGuarantee extends boolean>({
    fetcher,
    Context
}: GeneratorPropTypes<Data, PageSize, FetcherDetails, DataGuarantee>
) {
    return function PagingProvider(
        { serverRenderedData, startPage, children, details: givenDetails }: PropTypes<Data, PageSize, FetcherDetails>
    ) {
        const [state, setState_] = useState<StateTypes<Data, PageSize>>({
                data: serverRenderedData,
                page: startPage,
                allLoaded: false
        })
        const [loading, setLoading_] = useState(false)
        const loadingRef = useRef(loading)
        const setLoading = (newLoading: boolean) => {
            loadingRef.current = newLoading
            setLoading_(newLoading)
        }


        //Update state if you want to cause a rerender, else update ref.current
        const stateRef = useRef(state)
        const setState = (newState: StateTypes<Data, PageSize>) => {
            stateRef.current = newState
            setState_(newState)
        }
        const resetState = () => {
            stateRef.current = {
                data: serverRenderedData,
                page: startPage,
                allLoaded: false
            }
            loadingRef.current = false
        }

        const details = useRef(givenDetails)
        const setDetails = (newDetails: FetcherDetails, withFetch: boolean = true) => {
            details.current = newDetails
            resetState()
            if (withFetch) {
                loadMore()
            }
        }

        const initialRender = useRef(true);
        useEffect(() => {
            if (initialRender.current) {
                setDetails(givenDetails, false)
                initialRender.current = false;
            } else {
                setDetails(givenDetails);
            }
        }, [givenDetails]);

        
        const loadMore = async () => {
            if (loadingRef.current || stateRef.current.allLoaded) return []
            loadingRef.current = true
            const result = await fetcher({ 
                page: stateRef.current.page, 
                details: details.current 
            })
            if (!result.success || !result.data) {
                setState({ ...stateRef.current})
                setLoading(false)
                return []
            }
            if (!result.data.length) {
                setState({ ...stateRef.current, allLoaded: true })
                setLoading(false)
                return []
            }
            const newState = {
                data: [...stateRef.current.data, ...result.data],
                loading: false,
                allLoaded: false,
                page: { ...stateRef.current.page, page: stateRef.current.page.page + 1}
            };
            setState(newState)
            setLoading(false)
            return result.data
        }
        const refetch = async () => {
            const toPage = stateRef.current.page.page
            resetState()
            let data : Data[] = []
            for (let i = 0; i < toPage; i++) {
                data = [...data, ...(await loadMore())]
            }
            return data
        }

        return (
            <Context.Provider value={{ state, loadMore, refetch, serverRenderedData, startPage, setDetails}}>
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
        setDetails: (details: FetcherDetails, withFetch?: boolean) => void,
        serverRenderedData: Data[],
        startPage: Page<PageSize>,
    } | null>(null)
    return context
}

export default generatePagingProvider
export { generatePagingContext }
