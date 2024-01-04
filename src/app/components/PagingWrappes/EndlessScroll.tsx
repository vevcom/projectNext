'use client'
import { useContext, useEffect, useMemo } from 'react'
import type { PagingContextType } from '@/context/paging/PagingGenerator'
import { useInView } from 'react-intersection-observer'
import Button from '@/components/UI/Button'
import styles from './EndlessScroll.module.scss'
import RenderPageData from './RenderPageData'
import type { JSX } from 'react'

type PropTypes<Data, PageSize extends number> = {
    pageingContext: PagingContextType<Data, PageSize>,
    renderer: (data: Data) => JSX.Element,
}

export default function EndlessScroll<Data, const PageSize extends number>({ pageingContext, renderer }: PropTypes<Data, PageSize>) {
    const context = useContext(pageingContext)

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

    const renderedPageData = useMemo(() => <RenderPageData data={context.state.data} renderer={renderer} />, [context.state.data, renderer])

    return (
        <div className={styles.EndlessScroll}>
            {renderedPageData}
            <span className={styles.loadingControl}>
                {
                    context.state.allLoaded ? (
                        <i>No more images to load</i>
                    ) :
                        <div ref={ref}>
                            <Button onClick={() => context.loadMore()}>Load more</Button>
                        </div>
                }
            </span>
        </div>
    )
}
