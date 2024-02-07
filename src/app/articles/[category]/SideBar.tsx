'use client'

import { ReturnType } from '@/actions/cms/articleCategories/ReturnType'
import React from 'react'
import styles from './SideBar.module.scss'
import Link from 'next/link'
import { useRef } from 'react'
import useScroll from '@/hooks/useScroll'

function debounce(func: () => void, wait: number) {
    let timeout: NodeJS.Timeout;
    return function executedFunction() {
        const later = () => {
            clearTimeout(timeout);
            func();
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};


type PropTypes = {
    category: ReturnType
}

export default function SideBar({ category }: PropTypes) {
    const ref = useRef<HTMLDivElement>(null)
    const measure = useRef<HTMLDivElement>(null)

    //Makes sure the sidebar does not go under the footer
    useScroll((_, y) => {
        const mainRect = document.querySelector('main')?.getBoundingClientRect()
        const sidebarRect = measure.current?.getBoundingClientRect()
        const docHeight = document.documentElement.scrollHeight;
        const overscroll =  Math.max(0, window.innerHeight + y - docHeight)
        if (!mainRect || !sidebarRect || !ref.current) return;
        if (mainRect.bottom < sidebarRect.bottom) {
            ref.current.style.maxHeight = `${mainRect.bottom - sidebarRect.top + overscroll}px`
        } else {
            ref.current.style.maxHeight = `100%`
        }
    })

    return (
        <div ref={measure} className={styles.measure}>
            <div ref={ref} className={styles.SideBar}>
                <h2>{category.name.toUpperCase()}</h2>
                <ul>
                {
                    category.articles.map(article => (
                        <li key={article.id}>
                            <Link href={`/articles/${category.name}/${article.name}`}>
                                {article.name.toUpperCase()}
                            </Link>
                        </li>
                    ))
                }
                </ul>
            </div> 
        </div>     
    )
}
