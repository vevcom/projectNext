'use client'
import { useContext, useEffect, useMemo } from 'react'
import type { PagingContextType } from '@/context/paging/PagingGenerator'
import { useInView } from 'react-intersection-observer'
import Button from '@/components/UI/Button'
import styles from './EndlessScroll.module.scss'
import RenderPageData from './RenderPageData'
import type { JSX } from 'react'

type PropTypes<Data, PageSize extends number> = {
    pagingContext: PagingContextType<Data, PageSize>,
}

export default function EndlessScroll<Data, const PageSize extends number>({ pagingContext }: PropTypes<Data, PageSize>) {
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

    const renderedPageData = useMemo(() => <RenderPageData data={context.state.data} />, [context.state.data, renderer])

    return (
        <>
            {renderedPageData}
            <span className={styles.loadingControl}>
                {
                    context.state.allLoaded ? (
                        <i>Ingen flere bilder å laste inn</i>
                    ) :
                        <div ref={ref}>
                            <Button onClick={() => context.loadMore()}>Last inn flere</Button>
                        </div>
                }
            </span>
        </>
    )
}
