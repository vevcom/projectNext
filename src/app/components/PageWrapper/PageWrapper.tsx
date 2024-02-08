import styles from './PageWrapper.module.scss'
import React from 'react'

type PropTypes = {
    children: React.ReactNode,
    title: string,
    headerItem?: React.ReactNode
}

export default function PageWrapper({ title, children, headerItem }: PropTypes) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.inlineHeader}>
                <h1>{ title }</h1>

                <div>
                    { headerItem }
                </div>
            </div>

            { children }
        </div>
    )
}
