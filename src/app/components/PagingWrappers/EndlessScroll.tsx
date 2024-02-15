'use client'
import styles from './EndlessScroll.module.scss'
import Button from '@/components/UI/Button'
import React, { 
    useContext, 
    useEffect, 
    useMemo, 
    useCallback, 
    useState, 
    useRef 
} from 'react'
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

    // Do not show button right away if allLoaded is true, it can cause flicker
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        if (!context.state.allLoaded) {
            timerRef.current = setTimeout(() => {
                setShowButton(true);
            }, 500);
        } else {
            setShowButton(false);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [context.state.allLoaded]);

    return (
        <>
            {renderedPageData}
            <span ref={ref} className={styles.loadingControl}>
                <i style={{opacity: showButton ? 0 : 1}}>Ingen flere å laste inn</i>
                <Button style={{opacity: showButton ? 1 : 0}} onClick={loadMore}>Last inn flere</Button>
            </span>
        </>
    )
}
