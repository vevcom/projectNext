'use client'
import React, { useContext, useEffect, useMemo } from 'react'
import type { PagingContextType } from '@/context/paging/PagingGenerator'
import { useInView } from 'react-intersection-observer'
import Button from '@/components/UI/Button'
import styles from './EndlessScroll.module.scss'

type PropTypes<Data, PageSize extends number> = {
    pagingContext: PagingContextType<Data, PageSize>,
    renderer: (data: Data) => React.ReactNode,
}

export default function EndlessScroll<Data, const PageSize extends number>({ pagingContext, renderer }: PropTypes<Data, PageSize>) {
    const context = useContext(pagingContext)

    //This component must be rendered inside ContextProvider
    if (!context) throw new Error('No context')
    const [ref, inView] = useInView({
        threshold: 0,
    })

    useEffect(() => {
        if (inView) {
            context.loadMore()
        }
    }, [inView])

    const renderedPageData = useMemo(() => context.state.data.map(dataEntry => {
        if (context.serverRenderedData.includes(dataEntry)) return null
        return renderer(dataEntry)
    }), [context.state.data, renderer])

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
