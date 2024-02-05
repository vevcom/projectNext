'use client'

import { useContext } from "react"
import { OmegaquotePagingContext } from "./omegaquotesPaging"
import styles from "./omegaquotesComponents.module.scss"
import EndlessScroll from "../components/PagingWrappers/EndlessScroll"
import OmegaquoteQuote from "./omegaquotesQuote"

export type PropTypes = {
    serverRendered?: React.ReactNode,
}

export default function OmegaquoteList({ serverRendered } : PropTypes) {
    const context = useContext(OmegaquotePagingContext)

    //This component must be rendered inside a ImagePagingContextProvider
    if (!context) throw new Error('No context')

    return <>
        {serverRendered} {/* Rendered on server homefully in the right way*/}
        <EndlessScroll
            pagingContext={OmegaquotePagingContext}
            renderer={quote => <OmegaquoteQuote quote={quote}/>}
        />
    </>
}
