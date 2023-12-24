import { FormHTMLAttributes } from 'react'
import Button from './Button'
import { useFormState, useFormStatus } from 'react-dom'

type PropTypes =  Required<Pick<FormHTMLAttributes<HTMLFormElement>, 'action'>>
    & FormHTMLAttributes<HTMLFormElement> & {
    children: React.ReactNode,
    createText?: string,
}

const initialState = {
    error: null,
}

export default function Form({children, createText = "create", ...props}: PropTypes) {
    const { pending } = useFormStatus()
    const [state, formAction] = useFormState(props.action, initialState)
    
    return (
        <form {{
            ...props,
            action: formAction,
        }}>
            {children}
            <p aria-live="polite" className="sr-only">
                {state?.error}
            </p>
            <Button type="submit" aria-disabled={pending}> {createText} </Button>
        </form>
    )
}
