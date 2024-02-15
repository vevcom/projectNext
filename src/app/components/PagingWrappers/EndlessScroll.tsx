'use client'
import styles from './EndlessScroll.module.scss'
import Button from '@/components/UI/Button'
import React, { useContext, useEffect, useMemo, useCallback } from 'react'
import { useInView } from 'react-intersection-observer'
import type { PagingContextType } from '@/context/paging/PagingGenerator'

type PropTypes<Data, PageSize extends number, FetcherDetails> = {
    pagingContext: PagingContextType<Data, PageSize, FetcherDetails>,
    renderer: (data: Data, i: number) => React.ReactNode,
}

export default function EndlessScroll<Data, const PageSize extends number, FetcherDetails>({
    pagingContext,
    renderer
}: PropTypes<Data, PageSize, FetcherDetails>) {
    const context = useContext(pagingContext)

    //This component must be rendered inside ContextProvider
    if (!context) throw new Error('No context')
    const [ref, inView] = useInView({
        threshold: 0,
    })

    const loadMore = useCallback(async () => {
        if (context.state.allLoaded) return
        if (!inView) return
        await context.loadMore()
    }, [context.state.allLoaded, inView, context.loadMore])

    useEffect(() => {
        loadMore()
    }, [inView, loadMore])


    const renderedPageData = useMemo(() => context.state.data.map((dataEntry, i) => {
        if (i < context.startPage.pageSize * context.startPage.page) return null
        return renderer(dataEntry, i)
    }), [context.state.data, renderer, context.state.allLoaded])

    return (
        <>
            {renderedPageData}
            <span className={styles.loadingControl}>
                {
                    context.state.allLoaded ? (
                        <i>Ingen flere å laste inn</i>
                    ) :
                        <div ref={ref}>
                            <Button onClick={() => context.loadMore()}>Last inn flere</Button>
                        </div>
                }
            </span>
        </>
    )
}
