'use client'

import AddParts from '@/cms/AddParts'
import styles from './AddSection.module.scss'
import type { Part } from '@/cms/articleSections/update'
import { useRouter } from 'next/navigation'
import { addSectionToArticle } from '@/cms/articles/update'

type PropTypes = {
    articleId: number,
}

export default function AddSection({ articleId }: PropTypes) {
    const { refresh } = useRouter()

    const handleAdd = async (part: Part) => {
        addSectionToArticle(articleId, {
            [part]: true,
        })
        refresh()
    }
    return (
        <span className={styles.AddSection}>
            <AddParts 
                showParagraphAdd={true}
                showImageAdd={true}
                showLinkAdd={true}
                onClick={handleAdd}
            />
        </span>
    )
}
