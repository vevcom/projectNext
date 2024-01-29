'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import styles from './RemovePart.module.scss'
import { EditModeContext } from '@/context/EditMode';
import { useContext, useState } from 'react';
import { Part } from '@/actions/cms/articleSections/update';
import { removePart } from '@/actions/cms/articleSections/update';
import { useRouter } from 'next/navigation';
import Form from '@/components/Form/Form';
import useClickOutsideRef from '@/hooks/useClickOutsideRef';

type PropTypes = {
    part: Part,
    articleSectionName: string
}

export default function RemovePart({ part, articleSectionName }: PropTypes) {
    const { refresh } = useRouter()
    const editContext = useContext(EditModeContext)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const confirmRef = useClickOutsideRef(() => setConfirmOpen(false))
    if (!editContext?.editMode) return null
    const handleRemove = removePart.bind(null, articleSectionName).bind(null, part)

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
                        submitColor='red'
                    />
                </div>
            )
        }
        </div>
    );
}