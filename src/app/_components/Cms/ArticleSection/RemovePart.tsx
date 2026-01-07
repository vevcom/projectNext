'use client'
import styles from './RemovePart.module.scss'
import Form from '@/components/Form/Form'
import useEditMode from '@/hooks/useEditmode'
import useClickOutsideRef from '@/hooks/useClickOutsideRef'
import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ArticleSectionPart, RemovePartFromArticleSectionAction } from '@/cms/articleSections/types'
import type { ConfiguredAction } from '@/services/actionTypes'

type PropTypes = {
    part: ArticleSectionPart,
    removePartFromArticleSectionAction: ConfiguredAction<RemovePartFromArticleSectionAction>
}

export default function RemovePart({ part, removePartFromArticleSectionAction }: PropTypes) {
    const { refresh } = useRouter()
    //TODO: Authorizer must be passed in....
    const canEdit = useEditMode({
        authorizer: RequireNothing.staticFields({}).dynamicFields({})
    })
    const [confirmOpen, setConfirmOpen] = useState(false)
    const confirmRef = useClickOutsideRef(() => setConfirmOpen(false))
    if (!canEdit) return null
    const handleRemove = removePartFromArticleSectionAction.bind(null, { data: { part } })

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
