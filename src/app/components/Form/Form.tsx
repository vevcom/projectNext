'use client'
import { Children, FormHTMLAttributes,ButtonHTMLAttributes, ReactNode } from 'react'
import Button from '../UI/Button'
import { useFormStatus } from 'react-dom'
import { DetailedHTMLProps, useState } from 'react'
import styles from './Form.module.scss'
import type { Action } from '@/actions/type'
import { z } from 'zod'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck } from '@fortawesome/free-solid-svg-icons'

type Form = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
type PropTypes = Omit<Form, 'action' | 'children'> & {
    children: ReactNode,
    title?: string,
    createText?: string,
    action: Action
}
type Errors = {
    path: string | false,
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
    const [success, setSuccess] = useState(false)

    const actionWithError = async (formData: FormData) => { 
        const inputs_ = makeInputArray(children)
        setGeneralErrors(() => undefined)

        const { success: successFromAction, data, error: errorFromAction } = await action(formData)
        if (successFromAction) {
            setSuccess(true)
            setTimeout(() => setSuccess(false), 3000)
        } else {
            //No error provided
            if (!errorFromAction) return setGeneralErrors([
                {
                    path: false,
                    message: "error with input"
                }
            ])

            //Check for zod error
            const errorSchema = z.array(z.object({
                path: z.array(z.string()),
                message: z.string(),
            }))

            try {
                const parse = errorSchema.parse(JSON.parse(errorFromAction))
                //Error was of type zod
                const parsedError : Errors = parse.map(x => ({...x, path: x.path[0]}))

                parsedError.forEach(error => {
                    const inputWithError = inputs_.find((input) => input.input.label === error.path)
                    if (inputWithError) {
                        inputWithError.errors.push(error)
                    } else {
                        setGeneralErrors((prev) => prev ? [...prev, error] : [error])
                    }
                })
                setInputs(inputs_)
            } catch {
                //Error was not of type zod. for example prisma
                return setGeneralErrors([
                    {
                        path: false,
                        message: errorFromAction
                    }
                ])
            }            
        }   
        return data
    }

    return (
        <form className={styles.Form} action={actionWithError}  {...props}>
            <h2>{title}</h2>
            {
                inputs.map(({input, errors}, i) => (
                    <Input input={input} errors={errors} key={i} />
                ))
            }
            <SubmitButton success={success} generalErrors={generalErrors}>{createText}</SubmitButton>
        </form>
    )
}


function SubmitButton({children, generalErrors, success}: {children: ReactNode, generalErrors?: Errors, success: boolean}) {
    const { pending } = useFormStatus()
    const btnContent = () => {
        if (pending) return (
            <div className={styles.loader}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        )
        if (success) return (
            <FontAwesomeIcon icon={faCircleCheck} />
        )
        return children
    }

    return (
        <div className={styles.submit}>
            <Button aria-disabled={pending || success} color={success ? 'green' : 'primary'} type="submit">
                {btnContent()}
            </Button>
            <p className={[pending ? styles.pending : " ",  styles.error].join(' ')}>
                {
                    generalErrors && generalErrors[0]?.message
                }
            </p>
        </div>
    )
}

function Input({input, errors}: Input) {
    const { pending } = useFormStatus()
    return (
        <span>
            <div className={styles.input}>
                {input}
            </div>
                <p className={[pending ? styles.pending : " ",  styles.error].join(' ')}>
                {
                    errors && errors[0]?.message
                }
                </p>
        </span>
    )
}