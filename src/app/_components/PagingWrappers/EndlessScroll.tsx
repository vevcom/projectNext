'use client'
import styles from './EndlessScroll.module.scss'
import Button from '@/components/UI/Button'
import React, {
    useContext,
    useEffect,
    useMemo,
    useCallback,
    useState,
    useRef,
    useEffectEvent
} from 'react'
import { useInView } from 'react-intersection-observer'
import type { PagingContext } from '@/contexts/paging/PagingGenerator'

type PropTypes<Data, Cursor, PageSize extends number, FetcherDetails> = {
    pagingContext: PagingContext<Data, Cursor, PageSize, FetcherDetails>,
    renderer: (data: Data, i: number) => React.ReactNode,
    wrapper?: (children: React.ReactNode) => React.ReactNode,
    loadingInfoClassName?: string,
}

export default function EndlessScroll<Data, Cursor, const PageSize extends number, FetcherDetails>({
    pagingContext,
    loadingInfoClassName,
    renderer,
    wrapper = children => <>{children}</>,
}: PropTypes<Data, Cursor, PageSize, FetcherDetails>) {
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
    }, [context, inView])

    useEffect(() => {
        loadMore()
    }, [inView, loadMore])


    const renderedPageData = useMemo(() => context.state.data.map((dataEntry, i) => {
        if (i < context.startPage.pageSize * context.startPage.page) return null
        return renderer(dataEntry, i)
    }), [context, renderer])

    // Do not show button right away if allLoaded is true, it can cause flicker
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const [showButton, setShowButton] = useState(false)

    const updateShowButton = useEffectEvent(() => {
        if (!context.state.allLoaded) {
            timerRef.current = setTimeout(() => {
                setShowButton(true)
            }, 500)
        } else {
            setShowButton(false)
        }
    })

    useEffect(() => {
        updateShowButton()
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [context.state.allLoaded])

    return (
        <>
            {wrapper(renderedPageData)}
            <span ref={ref} className={`${styles.loadingControl} ${loadingInfoClassName}`}>
                <i style={{ opacity: showButton ? 0 : 1 }}>{
                    context.state.data.length === 0
                        ? 'Ingen data å laste inn'
                        : 'Ingen flere å laste inn'
                }</i>
                <Button style={{ opacity: showButton ? 1 : 0 }} onClick={loadMore}>Last inn flere</Button>
            </span>
        </>
    )
}
