'use client'
import { useContext, useEffect, useRef } from 'react'
import { EditModeContext } from '@/context/EditMode'
import styles from './EditModeSwitch.module.scss'
import type { ChangeEvent } from 'react'

export default function EditModeSwitch() {
    const editingContext = useContext(EditModeContext)
    const ref = useRef<HTMLInputElement>(null)
    if (!editingContext) throw new Error('No EditModeContext found')

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        editingContext.setEditMode(e.target.checked)
    }

    useEffect(() => {
        if (ref.current) {
            ref.current.checked = editingContext.editMode
        }
    }, [editingContext.editMode])

    return (
        <div className={styles.EditModeSwitch}>
            <input ref={ref} type="checkbox" id="editModeSwitch" onChange={handleChange} />
        </div>
    )
}
