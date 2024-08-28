'use client'

import OmegaquoteQuote from './omegaquotesQuote'
import { OmegaquotePagingContext } from '@/contexts/paging/OmegaquotesPaging'
import EndlessScroll from '@/components/PagingWrappers/EndlessScroll'
import React, { useContext } from 'react'

export type PropTypes = {
    serverRendered?: React.ReactNode,
}

export default function OmegaquoteList({ serverRendered }: PropTypes) {
    const context = useContext(OmegaquotePagingContext)

    //This component must be rendered inside a ImagePagingContextProvider
    if (!context) throw new Error('No context')

    return <>
        {serverRendered} {/* Rendered on server homefully in the right way*/}
        <EndlessScroll
            pagingContext={OmegaquotePagingContext}
            renderer={(quote, i) => <OmegaquoteQuote key={i} quote={quote}/>}
        />
    </>
}
