'use client'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { EditModeContext } from '@/context/EditMode'
import Form from '@/components/Form/Form'
import type { PropTypes as FormPropTypes } from '@/components/Form/Form'
import styles from './EditableTextField.module.scss'
import { set } from 'zod'

type PropTypes<ReturnType, DataGuaratee extends boolean> = {
    props?: Omit<React.HTMLAttributes<HTMLElement>, 'children' | 'contentEditable'>
    editable: boolean,
    children: React.ReactNode,
    formProps: Omit<FormPropTypes<ReturnType, DataGuaratee>, 'title' | 'children' | 'submitText'>
    submitButton: {
        text?: string,
        name: string,
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
    const [value, setValue] = useState('');
    const [noChange, setNoChange] = useState(true)
    const editMode = useContext(EditModeContext)
    const ref = useRef<HTMLInputElement>(null)
    
    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        setNoChange(false)
        console.log(value)
        setValue(e.currentTarget.textContent || '');
    };

    useEffect(() => {
        ref.current?.setAttribute('value', value)
    }, [value])

    if (!editMode?.editMode || !editable) return (children)
    return (
        <div className={styles.EditableTextField}>
            <div contentEditable={true} onInput={handleInput} {...props}>
                {children}
            </div>
            <Form className={noChange ? styles.hiddenInput : ''} submitText={submitButton.text} {...formProps}>
                <input className={styles.hiddenInput} ref={ref} name={submitButton.name} />
            </Form>
        </div>
        
    );
}
