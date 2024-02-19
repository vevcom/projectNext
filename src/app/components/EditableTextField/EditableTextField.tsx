import styles from './EditableTextField.module.scss'
import Form from '@/components/Form/Form'
import { EditModeContext } from '@/context/EditMode'
import useKeyPress from '@/hooks/useKeyPress'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import type { PropTypes as FormPropTypes } from '@/components/Form/Form'

type PropTypes<ReturnType, DataGuaratee extends boolean> = {
    props?: Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'contentEditable'>
    editable: boolean,
    children: React.ReactNode,
    formProps: Omit<FormPropTypes<ReturnType, DataGuaratee>, 'title' | 'children' | 'submitText'>
    submitButton: {
        text?: string,
        name: string,
        className?: string,
    }
}

export default function EditableTextField<ReturnType, DataGuaratee extends boolean>({
    editable,
    children,
    formProps,
    submitButton,
    ...props
}: PropTypes<ReturnType, DataGuaratee>
) {
    const [value, setValue] = useState('')
    const [noChange, setNoChange] = useState(true)
    const editMode = useContext(EditModeContext)
    const ref = useRef<HTMLInputElement>(null)
    const submitRef = useRef<HTMLButtonElement>(null)
    useKeyPress('Enter', () => {
        console.log(!!ref.current)
        if (noChange) return
        submitRef.current?.click()
    })

    useEffect(() => {
        setNoChange(true)
    }, [editMode?.editMode])

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        setNoChange(false)
        setValue(e.currentTarget.textContent || '')
    }

    useEffect(() => {
        ref.current?.setAttribute('value', value)
    }, [value])

    if (!editMode?.editMode || !editable) return (children)
    return (
        <div className={styles.EditableTextField}>
            <div
                className={styles.text}
                contentEditable={true}
                onInput={handleInput}
                {...props}
                onKeyDown={(e) => { if (e.key === 'Enter') e.preventDefault() }}
            >
                {children}
            </div>
            <FontAwesomeIcon className={styles.icon} icon={faPencil} />
            <Form
                {...formProps}
                className={
                    noChange ? (
                        `${styles.hiddenInput} ${submitButton.className}`
                    ) : (
                        `${styles.input} ${submitButton.className}`
                    )}
                submitText={submitButton.text}
                successCallback={(data: ReturnType | undefined) => {
                    setNoChange(true)
                    formProps.successCallback?.(data)
                }}
            >
                <input className={styles.hiddenInput} ref={ref} name={submitButton.name} />
                <button className={styles.hiddenInput} ref={submitRef} type="submit"></button>
            </Form>
        </div>
    )
}
