'use client'
import { ReactNode } from 'react'
import styles from './OldNewsList.module.scss'

type PropTypes = {
    serverRendered: ReactNode
}

export default function OldNewsList({ serverRendered }: PropTypes) {
    return (
        <div className={styles.OldNewsList}>
            { serverRendered }
        </div>
    )
}
