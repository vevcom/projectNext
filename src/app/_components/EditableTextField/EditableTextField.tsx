'use client'
import styles from './EditableTextField.module.scss'
import Form from '@/components/Form/Form'
import useKeyPress from '@/hooks/useKeyPress'
import useEditing from '@/hooks/useEditing'
import React, { useEffect, useState, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import type { PropTypes as FormPropTypes } from '@/components/Form/Form'

type PropTypes<ReturnType, DataGuaratee extends boolean> = {
    props?: Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'contentEditable'>
    editable: boolean,
    children: React.ReactNode,
    formProps: Omit<FormPropTypes<ReturnType, DataGuaratee>, 'title' | 'children' | 'submitText'>
    inputName: string,
    submitButton: {
        text: string,
        className?: string,
    }
}

/**
 * A component that wraps a text element in a form that can be submitted to update the text
 * @param editable - Whether the text should be editable
 * @param children - The text to display
 * @param formProps - The props to pass to the form (the component use Form internally)
 * @param submitButton - The props to pass to the submit button
 * @param props - further props to pass to the text element
 */
export default function EditableTextField<ReturnType, DataGuaratee extends boolean>({
    editable,
    children,
    formProps,
    submitButton,
    inputName,
    ...props
}: PropTypes<ReturnType, DataGuaratee>
) {
    const [value, setValue] = useState('')
    const [noChange, setNoChange] = useState(true)
    const canEdit = useEditing({}) //TODO: auth must be passed
    const ref = useRef<HTMLInputElement>(null)
    const submitRef = useRef<HTMLButtonElement>(null)
    useKeyPress('Enter', () => {
        if (noChange) return
        submitRef.current?.click()
    })

    useEffect(() => {
        setNoChange(true)
    }, [canEdit])

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        setNoChange(false)
        setValue(e.currentTarget.textContent || '')
    }

    useEffect(() => {
        ref.current?.setAttribute('value', value)
    }, [value])

    if (!canEdit || !editable) return (children)
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
                <input className={styles.hiddenInput} ref={ref} name={inputName} />
                <button className={styles.hiddenInput} ref={submitRef} type="submit"></button>
            </Form>
        </div>
    )
}
