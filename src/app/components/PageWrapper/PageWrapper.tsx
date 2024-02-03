import styles from './PageWrapper.module.scss'
import React from 'react'

type PropTypes = {
    children: React.ReactNode,
    title: string
}

export default function PageWrapper({title, children}: PropTypes) {
    return (
        <div className={styles.wrapper}>
            <h1>{ title }</h1>

            { children }
        </div>
    )
}
