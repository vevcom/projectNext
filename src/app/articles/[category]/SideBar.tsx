'use client'
import { ReturnType } from '@/actions/cms/articleCategories/ReturnType'
import React from 'react'
import styles from './SideBar.module.scss'
import Link from 'next/link'
import { useRef, useState } from 'react'
import useScroll from '@/hooks/useScroll'
import useOnNavigation from '@/hooks/useOnNavigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import useViewPort from '@/hooks/useViewPort'
import EditCategory from './EditCategory'

type PropTypes = {
    category: ReturnType
    children: React.ReactNode
}

export default function SideBar({ category, children }: PropTypes) {
    const ref = useRef<HTMLDivElement>(null)
    const measure = useRef<HTMLDivElement>(null)
    const [openMobile, setOpenMobile] = useState(false)

    //Makes sure the sidebar does not go under the footer
    const handleHeight = (x: number, y: number) => {
        const mainRect = document.querySelector('main')?.getBoundingClientRect()
        const sidebarRect = measure.current?.getBoundingClientRect()
        const docHeight = document.documentElement.scrollHeight;
        const overscroll =  Math.max(0, window.innerHeight + y - docHeight)
        if (!mainRect || !sidebarRect || !ref.current) return;
        ref.current.style.opacity = '1'
        if (mainRect.bottom < sidebarRect.bottom) {
            ref.current.style.maxHeight = `${mainRect.bottom - sidebarRect.top - 10 + overscroll}px`
        } else {
            ref.current.style.maxHeight = `100%`
        }
    }

    useScroll(handleHeight)
    useOnNavigation(() => handleHeight(window.screenX, window.scrollY))
    useOnNavigation(() => setOpenMobile(false))
    useViewPort(() => handleHeight(window.screenX, window.scrollY))

    return (
        <div className={styles.SideBar}>
            <aside>
                <div ref={measure} className={styles.measure}>
                    <div ref={ref} className={styles.SideBarContent}>
                        <h2>{category.name.toUpperCase()}</h2>
                        <MainListContent category={category} />
                    </div> 
                </div> 
            </aside>
         
            <main>
                {children}
            </main>

            <span className={ openMobile ? 
                `${styles.SideBarMobile} ${styles.SideBarMobileOpen}` : 
                `${styles.SideBarMobile} ${styles.SideBarMobileClosed}`
            }>
                <button onClick={() => setOpenMobile(x => !x)}>
                    <FontAwesomeIcon icon={faChevronUp} />
                    <h1>{category.name.toUpperCase()}</h1>
                </button>
                <MainListContent category={category} />
            </span>
        </div>
          
    )
}

function MainListContent({ category }: { category: ReturnType }) {

    return (
        <ul className={styles.MainListContent}>
        {
            category.articles.map(article => (
                <li key={article.id}>
                    <Link href={`/articles/${category.name}/${article.name}`}>
                        {article.name.toUpperCase()}
                    </Link>
                </li>
            ))
        }
        <EditCategory category={category} />
        </ul>
    )
}
