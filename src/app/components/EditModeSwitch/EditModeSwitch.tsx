'use client'
import { useContext, useEffect, useRef } from 'react'
import { EditModeContext } from '@/context/EditMode'
import styles from './EditModeSwitch.module.scss'
import type { ChangeEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'

export default function EditModeSwitch() {
    const editingContext = useContext(EditModeContext)
    if (!editingContext) throw new Error('No EditModeContext found')

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        editingContext.setEditMode(e.target.checked)
    }
    const isAdmin = true
    if (!isAdmin) return null

    const ref = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (ref.current?.checked) {
            ref.current.checked = editingContext.editMode
        }
    }, [])

    return (
        <div className={styles.EditModeSwitch}>
            <label>
                <input ref={ref} checked={editingContext.editMode} type="checkbox" onChange={handleChange} />
                <FontAwesomeIcon className={styles.EditModeSwitchIcon} icon={faPencil} />
            </label>
        </div>
    )
}
