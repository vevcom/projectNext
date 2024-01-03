'use client'
import { useContext, useEffect } from 'react'
import type { PagingContextType } from '@/context/paging/PagingGenerator'
import { useInView } from 'react-intersection-observer'
import Button from '@/components/UI/Button'
import styles from './EndlessScroll.module.scss'
import RenderPageData from './RenderPageData'

type PropTypes<Data, PageSize extends number, FetcherDetails> = {
    pageingContext: PagingContextType<Data, PageSize, FetcherDetails>,
    details: FetcherDetails,
    renderer: (data: Data) => JSX.Element,
}

export default function EndlessScroll<Data, const PageSize extends number, FetcherDetails>
({ pageingContext, details, renderer }: PropTypes<Data, PageSize, FetcherDetails>) {
    const context = useContext(pageingContext)

    //This component must be rendered inside ContextProvider
    if (!context) throw new Error('No context')
    const [ref, inView] = useInView({
        threshold: 0,
    })

    useEffect(() => {
        if (inView) {
            context.loadMore(details)
        }
    }, [inView])


    return (
        <div className={styles.EndlessScroll}>
            <RenderPageData data={context.state.data} renderer={renderer} />
            <span className={styles.loadingControl} ref={ref}>
                {
                    context.state.allLoaded ? (
                        <i>No more images to load</i>
                    ) : 
                        <div ref={ref}>
                            <Button onClick={() => context?.loadMore(details)}>Load more</Button>
                        </div>
                }
            </span>
        </div>
    )
}
