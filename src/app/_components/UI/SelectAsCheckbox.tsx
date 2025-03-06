'use client'
import styles from './SelectAsCheckbox.module.scss'
import { InputHTMLAttributes, useCallback, useEffect, useRef } from 'react'

export type PropTypes = Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'name' | 'id'> & {
    id: string
    name: string | undefined
    children?: React.ReactNode
}

/**
 * This component looks like a checkbox but also ads a select input with the spesfied input name
 * so the submittion looks like a selector with 'on' 'off' values instead of 'on' / undefined values
 * as checkboxes do in html.
 * It also does not show the select input to the user
 * It also does submit the checkbox, but under the name name + 'Checkbox'
 * @returns 
 */
export default function SelectAsCheckbox({ name, children, ...props }: PropTypes) {
    const selectRef = useRef<HTMLSelectElement | null>(null)

    /**
     * Make sure the select is kept up to date with the checkbox
     */
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const select = e.target.checked ? 'on' : 'off'
        if (selectRef.current) selectRef.current.value = select
    }, [selectRef])

    useEffect(() => {
        if (selectRef.current) {
            selectRef.current.value = props.checked ? 'on' : 'off'
        }
    }, [props.checked, selectRef])

    return (
        <>
            <input 
                {...props} 
                className={styles.checkbox} 
                name={`${name}Checkbox`} 
                type="checkbox" 
                onChange={handleChange} 
            />
            {children}
            <select ref={selectRef} name={name} className={styles.hiddenSelect}>
                <option value="on" />
                <option value="off" />
            </select>
        </>
    )
}
