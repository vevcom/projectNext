'use client'
import styles from './EditableTextField.module.scss'
import Form from '@/components/Form/Form'
import useEditMode from '@/hooks/useEditMode'
import useKeyPress from '@/hooks/useKeyPress'
import React, { useEffect, useState, useRef, useEffectEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import type { PropTypes as FormPropTypes } from '@/components/Form/Form'
import type { AuthorizerDynamicFieldsBound } from '@/auth/authorizer/Authorizer'
import type { AuthResultTypeAny } from '@/auth/authorizer/AuthResult'

type PropTypes<ReturnType> = {
    props?: Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'contentEditable'>
    children: React.ReactNode,
    formProps: Omit<FormPropTypes<ReturnType>, 'title' | 'children' | 'submitText'>
    inputName: string,
    submitButton: {
        text: string,
        className?: string,
    }
} & (
    { authorizer: AuthorizerDynamicFieldsBound, authResult?: undefined } |
    { authorizer?: undefined, authResult: AuthResultTypeAny }
)

/**
 * A component that wraps a text element in a form that can be submitted to update the text
 * @param authorizer - The authorizer used to determine if the field may be edited. Alternatively,
 * pass authResult when the auth decision must be made server side - see useEditMode.
 * @param authResult - Precomputed auth result, alternative to authorizer - see useEditMode.
 * @param children - The text to display
 * @param formProps - The props to pass to the form (the component use Form internally)
 * @param submitButton - The props to pass to the submit button
 * @param props - further props to pass to the text element
 */
export default function EditableTextField<ReturnType>({
    authorizer,
    authResult,
    children,
    formProps,
    submitButton,
    inputName,
    ...props
}: PropTypes<ReturnType>) {
    const [value, setValue] = useState('')
    const [noChange, setNoChange] = useState(true)
    const canEdit = useEditMode(authResult ? { authResult } : { authorizer })
    const ref = useRef<HTMLInputElement>(null)
    const submitRef = useRef<HTMLButtonElement>(null)
    useKeyPress('Enter', () => {
        if (noChange) return
        submitRef.current?.click()
    })

    const resetNoChange = useEffectEvent(() => setNoChange(true))

    useEffect(() => {
        resetNoChange()
    }, [canEdit])

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        setNoChange(false)
        setValue(e.currentTarget.textContent || '')
    }

    useEffect(() => {
        ref.current?.setAttribute('value', value)
    }, [value])

    if (!canEdit) {
        return (
            <>{children}</>
        )
    }
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
