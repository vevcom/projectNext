'use client'
import styles from './SlideInOnView.module.scss'
import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

type PropTypes = {
    children: ReactNode
    direction?: 'left' | 'right' | 'top' | 'bottom'
}

export default function SlideInOnView({ children, direction = 'bottom' }: PropTypes) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    ref.current?.classList.add(styles.visible)
                }
            },
            {
                threshold: 0.1,
            }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [])

    return (
        <div ref={ref} className={`${styles.SlideInOnView} ${styles[direction]}`}>
            {children}
        </div>
    )
}
