import styles from './PageWrapper.module.scss'
import PageTitleSetter from '@/contexts/PageTitleSetter'
import React from 'react'

export default function PageWrapper({
    title,
    children,
    headerItem,
    titleClassName,
}: {
    children: React.ReactNode,
    title: string,
    headerItem?: React.ReactNode,
    titleClassName?: string,
}) {
    return (
        <div className={styles.wrapper}>
            <PageTitleSetter title={title} />
            <div className={styles.inlineHeader}>
                <h1 className={titleClassName}>{ title }</h1>

                <div>
                    { headerItem }
                </div>
            </div>

            { children }
        </div>
    )
}
