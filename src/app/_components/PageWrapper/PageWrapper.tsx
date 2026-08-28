import styles from './PageWrapper.module.scss'
import PageTitleSetter from '@/contexts/PageTitleSetter'
import React from 'react'

export default function PageWrapper({
    title,
    children,
    headerItem,
    //titleClassName,
    fillHeight = false,
    hideTitle = false,
    transparent = false,
}: {
    children: React.ReactNode,
    title: string,
    headerItem?: React.ReactNode,
    //titleClassName?: string,
    fillHeight?: boolean,
    hideTitle?: boolean,
    /** For pages laid out as islands: drops the wrapper's surface-base panel so the page background shows through. */
    transparent?: boolean,
}) {
    const wrapperClass = [
        styles.wrapper,
        fillHeight && styles.fillHeight,
        transparent && styles.transparent,
    ].filter(Boolean).join(' ')

    return (
        <div className={wrapperClass}>
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
