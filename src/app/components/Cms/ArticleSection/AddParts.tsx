'use client'
import type { Part } from "@/actions/cms/articleSections/update"
import { useContext } from "react"
import { EditModeContext } from "@/context/EditMode"
import { addPart } from "@/actions/cms/articleSections/update"
import styles from './AddParts.module.scss'

type PropTypes = {
    articleSectionName: string
}

export default function AddPart({ articleSectionName }: PropTypes) {
    const editContext = useContext(EditModeContext)
    if (!editContext?.editMode) return null
    const parts : Part[] = ['cmsParagraph', 'cmsImage', 'cmsLink'] 

    return (
        <div className={styles.AddPart}>
            {
                parts.map((part, i) => (
                    <button key={i} onClick={addPart.bind(null, articleSectionName).bind(null, part)}>
                        {part}
                    </button>
                ))
            }
        </div>
    )
}