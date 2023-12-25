'use client'

import { FormHTMLAttributes } from 'react'
import Button from './Button'
import { useFormStatus } from 'react-dom'
import { DetailedHTMLProps, useState } from 'react'

type Form = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>

type PropTypes = Form & {
    children: React.ReactNode,
    title?: string,
    createText?: string,
}

export default function Form({children, title, createText = "create", ...props}: PropTypes) {
    const { pending } = useFormStatus()
    const [error, setError] = useState<string>('')

    const action = props.action
    if (!action) throw new Error('Form must have an action prop')
    if (typeof action !== 'function') throw new Error('Form action prop must be a function')

    return (
        <form {...props}>
            <h3>{title}</h3>
            {children}
            <p aria-live="polite" className="sr-only">
                {error}
            </p>
            <Button type="submit" aria-disabled={pending}> {createText} </Button>
        </form>
    )
}
