'use client'
import type { Part } from "@/actions/cms/articleSections/update"
import { useCallback, useContext } from "react"
import { EditModeContext } from "@/context/EditMode"
import { addPart } from "@/actions/cms/articleSections/update"
import styles from './AddParts.module.scss'
import { useRouter } from "next/navigation"

type PropTypes = {
    articleSectionName: string
}

export default function AddPart({ articleSectionName }: PropTypes) {
    const { refresh } = useRouter()
    const editContext = useContext(EditModeContext)
    if (!editContext?.editMode) return null
    const parts : Part[] = ['cmsParagraph', 'cmsImage', 'cmsLink'] 
    const handleAdd = useCallback(async (part: Part) => {
        await addPart(articleSectionName, part)
        refresh()
    }, [articleSectionName])

    return (
        <div className={styles.AddPart}>
            {
                parts.map((part, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleAdd(part)}
                    >
                        {part}
                    </button>
                ))
            }
        </div>
    )
}