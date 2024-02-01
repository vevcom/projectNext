'use client'
import styles from './AddParts.module.scss'
import BorderButton from '@/components/UI/BorderButton'
import { EditModeContext } from '@/context/EditMode'
import { addPart } from '@/cms/articleSections/update'
import { useCallback, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import type { Part } from '@/actions/cms/articleSections/update'
import type { ReactNode } from 'react'

type PropTypes = {
    articleSectionName: string,
    children: ReactNode,
    showParagraphAdd: boolean,
    showImageAdd: boolean,
    showLinkAdd: boolean
}

export default function AddParts({
    articleSectionName,
    children,
    showImageAdd,
    showLinkAdd,
    showParagraphAdd
}: PropTypes) {
    const { refresh } = useRouter()
    const editContext = useContext(EditModeContext)
    const handleAdd = useCallback(async (part: Part) => {
        await addPart(articleSectionName, part)
        refresh()
    }, [articleSectionName])
    const parts : {
        shouldShow: boolean,
        part: Part
        text: string
    }[] = [
        {
            shouldShow: showParagraphAdd,
            part: 'cmsParagraph',
            text: 'paragraph'
        },
        {
            shouldShow: showImageAdd,
            part: 'cmsImage',
            text: 'image'
        },
        {
            shouldShow: showLinkAdd,
            part: 'cmsLink',
            text: 'link'
        }
    ]

    if (!editContext?.editMode) return children

    return (
        <div className={styles.AddParts}>
            {children}
            <div className={styles.addControls}>
                {
                    parts.map((part, i) => part.shouldShow && (
                        <BorderButton
                            key={i}
                            onClick={() => handleAdd(part.part)}
                            color="secondary"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            {part.text}
                        </BorderButton>
                    ))
                }
            </div>
        </div>
    )
}
