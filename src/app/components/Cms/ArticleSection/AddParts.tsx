'use client'
import styles from './AddParts.module.scss'
import BorderButton from '../../UI/BorderButton'
import { EditModeContext } from '@/context/EditMode'
import { addPart } from '@/actions/cms/articleSections/update'
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

export default function AddPart({
    articleSectionName,
    children,
    showImageAdd,
    showLinkAdd,
    showParagraphAdd
}: PropTypes) {
    const { refresh } = useRouter()
    const editContext = useContext(EditModeContext)
    if (!editContext?.editMode) return children
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
    const handleAdd = useCallback(async (part: Part) => {
        await addPart(articleSectionName, part)
        refresh()
    }, [articleSectionName])

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
