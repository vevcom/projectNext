'use client'
import { useContext, useEffect } from 'react'
import type { PagingContextType } from '@/context/paging/PagingGenerator'
import { useInView } from 'react-intersection-observer'
import Button from '@/components/UI/Button'


export default function EndlessScroll<Data, const PageSize extends number, FetcherDetails>
(pageingContext: PagingContextType<Data, PageSize, FetcherDetails>, details: FetcherDetails) {
    const context = useContext(pageingContext)

    //This component must be rendered inside a ImagePagingContextProvider
    if (!context) throw new Error('No context')
    const [ref, inView] = useInView({
        threshold: 0,
    })

    useEffect(() => {
        if (inView) {
            context?.loadMore(details)
        }
    }, [inView])

    return (
        <div ref={ref}>
            {
                context.state.allLoaded ? (
                    <i>No more images to load</i>
                ) : 
                    <div ref={ref}>
                        <Button onClick={() => context?.loadMore(details)}>Load more</Button>
                    </div>
            }
        </div>
    )
}
