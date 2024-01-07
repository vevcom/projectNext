'use client'
import { useContext, useRef } from 'react'
import { EditModeContext } from '@/context/EditMode'
import styles from './EditModeSwitch.module.scss'
import type { ChangeEvent } from 'react'

export default function EditModeSwitch() {
    const editingContext = useContext(EditModeContext)
    const ref = useRef<HTMLInputElement>(null)
    if (!editingContext) throw new Error('No EditModeContext found')

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        editingContext.setEditMode(e.target.checked)
    }

    return (
        <div className={styles.EditModeSwitch}>
            <label>Edit</label>
            <div>
                <input checked={editingContext.editMode} type="checkbox" id="editModeSwitch" onChange={handleChange} />
                <span className={styles.slider}></span>
            </div>
        </div>
    )
}
