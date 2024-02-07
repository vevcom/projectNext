
import { ReturnType } from '@/actions/cms/articleCategories/ReturnType'
import React from 'react'
import styles from './SideBar.module.scss'
import Link from 'next/link'

type PropTypes = {
    category: ReturnType
}

export default function SideBar({ category }: PropTypes) {
  return (
    <div className={styles.SideBar}>
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
  )
}
