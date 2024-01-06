'use client'
import { useContext } from 'react'
import { EditModeContext } from '@/context/EditMode'
import styles from './EditModeSwitch.module.scss'
import type { ChangeEvent } from 'react'

export default function EditModeSwitch() {
    const editingContext = useContext(EditModeContext)
    if (!editingContext) throw new Error('No EditModeContext found')

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        editingContext.setEditMode(e.target.checked)
    }

    return (
        <div className={styles.EditModeSwitch}>
            <input type="checkbox" id="editModeSwitch" onChange={handleChange} />
            <label htmlFor="editModeSwitch">Redigeringsmodus</label>
        </div>
    )
}
