'use client'
import styles from './AddParts.module.scss'
import BorderButton from '@/components/UI/BorderButton'
import { EditModeContext } from '@/context/EditMode'
import { useContext } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import type { Part } from '@/cms/articleSections/update'
import type { ReactNode } from 'react'

/**
 * Component for adding parts to an article and article section.
 * Used by two wrapper components: AddSection and AddPartToArticleSection for atricle and article section respectively.
 */

export type PropTypes = {
    children?: ReactNode,
    showParagraphAdd: boolean,
    showImageAdd: boolean,
    showLinkAdd: boolean
    onClick: (part: Part) => Promise<void>
}

export default function AddParts({
    children,
    showImageAdd,
    showLinkAdd,
    showParagraphAdd,
    onClick
}: PropTypes) {
    const editContext = useContext(EditModeContext)
    
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
            <div className={
                parts.some(part => part.shouldShow) ?
                    `${styles.wrapper} ${styles.paddingBottom}`
                    :
                    styles.wrapper
            }>
                {children}
                <div className={styles.addControls}>
                    {
                        parts.map((part, i) => part.shouldShow && (
                            <BorderButton
                                key={i}
                                onClick={() => onClick(part.part)}
                                color="secondary"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                {part.text}
                            </BorderButton>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}
