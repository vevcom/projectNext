import styles from './PageWrapper.module.scss'
import PageTitleSetter from '@/contexts/PageTitleSetter'
import React from 'react'

export default function PageWrapper({
    title,
    children,
    headerItem,
    titleClassName,
    fillHeight = false,
    hideTitle = false,
}: {
    children: React.ReactNode,
    title: string,
    headerItem?: React.ReactNode,
    titleClassName?: string,
    fillHeight?: boolean,
    hideTitle?: boolean,
}) {
    return (
        <div className={`${styles.wrapper} ${fillHeight ? styles.fillHeight : ''}`}>
            <PageTitleSetter title={title} />
            {!hideTitle && (
                <div className={styles.inlineHeader}>
                    {/* TODO If anyone wants this we can keep it
                    <h1 className={titleClassName}>{ title }</h1>
                    */}

                    <div>
                        { headerItem }
                    </div>
                </div>
            )}

            <div className={styles.body}>
                { children }
            </div>
        </div>
    )
}
