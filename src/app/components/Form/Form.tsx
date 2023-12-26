'use client'
import { Children, FormHTMLAttributes,ButtonHTMLAttributes, ReactNode } from 'react'
import Button from '../UI/Button'
import { useFormStatus } from 'react-dom'
import { DetailedHTMLProps, useState } from 'react'
import styles from './Form.module.scss'
import type { Action } from '@/actions/type'
import { z } from 'zod'

type Form = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
type PropTypes = Omit<Form, 'action' | 'children'> & {
    children: ReactNode,
    title?: string,
    createText?: string,
    action: Action
}
type Errors = {
    path: string,
    message: string
}[]
type Input = {
    input: ReactNode & { label?: string },
    errors: Errors
}
type Inputs = Input[]

const makeInputArray = (children: ReactNode) : Inputs => 
    Children.toArray(children).map((child : ReactNode & { props?: {id?: string} }) => {
        if (typeof child !== "object") return {
            input: child,
            errors: [],
        }
        return {
            input: {...child, label: child.props.id },
            errors: [],
        }  
    })

export default function Form({children, title, createText = "create", action, ...props}: PropTypes) {
    const [generalErrors, setGeneralErrors] = useState<Errors>()
    const [inputs, setInputs] = useState<Inputs>(makeInputArray(children))
    

    const actionWithError = async (formData: FormData) => { 
        const inputs_ = makeInputArray(children)

        const { success, data, error: errorFromAction } = await action(formData)
        if (success) {

        } else {
            if (!errorFromAction) return setGeneralErrors([
                {
                    path: "unknown",
                    message: "error with input"
                }
            ])
            const errorSchema = z.array(z.object({
                path: z.array(z.string()),
                message: z.string(),
            }))
            const parsedError : Errors = errorSchema.parse(JSON.parse(errorFromAction)).map(x => ({...x, path: x.path[0]}))
            parsedError.forEach(error => {
                const inputWithError = inputs_.find((input) => input.input.label === error.path)
                if (inputWithError) {
                    inputWithError.errors.push(error)
                } else {
                    setGeneralErrors((prev) => prev ? [...prev, error] : [error])
                }
            })
            setInputs(inputs_)
        }   
        return data
    }

    return (
        <form className={styles.Form} action={actionWithError}  {...props}>
            <h3>{title}</h3>
            {
                inputs.map(({input, errors}, i) => (
                    <Input input={input} errors={errors} key={i} />
                ))
            }
            <p className={styles.error}>{generalErrors?.map(({message}) => message)}</p>
            <SubmitButton>{createText}</SubmitButton>
        </form>
    )
}


function SubmitButton({children}: {children: ReactNode}) {
    const { pending } = useFormStatus()
    return (
        <Button aria-disabled={pending} color="primary" type="submit">
            {pending ? "loading" : children}
        </Button>
    )
}

function Input({input, errors}: Input) {
    const { pending } = useFormStatus()
    return (
        <div className={pending ? styles.pendingInput : ""}>
            {input}
            {!pending && 
                <p className={styles.error}>
                    {errors.map(({message}) => message)}
                </p>
            }
        </div>
    )
}