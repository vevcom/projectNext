'use client'

import { Children, FormHTMLAttributes } from 'react'
import Button from '../UI/Button'
import { useFormStatus } from 'react-dom'
import { DetailedHTMLProps, useState } from 'react'
import styles from './Form.module.scss'
import type { Action } from '@/actions/type'

type Form = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>

type PropTypes = Omit<Form, 'action'> & {
    children: React.ReactNode,
    title?: string,
    createText?: string,
    action: Action
}

export default function Form({children, title, createText = "create", action, ...props}: PropTypes) {
    const { pending } = useFormStatus()
    const [error, setError] = useState('')

    const actionWithError = async (formData: FormData) => { 
        const { success, data, error } = await action(formData)
        if (!success) setError(error ? error : 'An error occured')
        return data
    }

    const childArray = Children.toArray(children)

    return (
        <form className={styles.Form} action={actionWithError}  {...props}>
            <h3>{title}</h3>
            {
                childArray.map((child, i) => (
                    <div key={i}>
                        {child}
                        <p className={styles.error}></p>
                    </div>
                ))
            }
            <p className={styles.error}>{error}</p>
            <Button type="submit" aria-disabled={pending}> {createText} </Button>
        </form>
    )
}
