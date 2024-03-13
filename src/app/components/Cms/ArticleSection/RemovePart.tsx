'use client'
import styles from './RemovePart.module.scss'
import { EditModeContext } from '@/context/EditMode'
import { removeArticleSectionPart } from '@/cms/articleSections/update'
import Form from '@/components/Form/Form'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import { useRouter } from 'next/navigation'
import { useContext, useState } from 'react'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ArticleSectionPart } from '@/cms/articleSections/Types'

type PropTypes = {
    part: ArticleSectionPart,
    articleSectionName: string
}

export default function RemovePart({ part, articleSectionName }: PropTypes) {
    const { refresh } = useRouter()
    const editContext = useContext(EditModeContext)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const confirmRef = useClickOutsideRef(() => setConfirmOpen(false))
    if (!editContext?.editMode) return null
    const handleRemove = removeArticleSectionPart.bind(null, articleSectionName).bind(null, part)

    return (
        <div ref={confirmRef} className={styles.RemovePart}>
            <button className={styles.openBtn} onClick={() => setConfirmOpen(x => !x)}>
                <FontAwesomeIcon icon={faX} />
            </button>
            {
                confirmOpen && (
                    <div className={styles.confirmation}>
                        <Form
                            action={handleRemove}
                            submitText="Remove"
                            successCallback={() => {
                                refresh()
                            }}
                            submitColor="red"
                        />
                    </div>
                )
            }
        </div>
    )
}
