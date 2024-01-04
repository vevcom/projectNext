'use client'
import { Children, FormHTMLAttributes, ReactNode } from 'react'
import Button from '../UI/Button'
import { useFormStatus } from 'react-dom'
import { DetailedHTMLProps, useState } from 'react'
import styles from './Form.module.scss'
import type { Action } from '@/actions/type'
import type { ActionError } from '@/actions/type'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faX } from '@fortawesome/free-solid-svg-icons'
import type { PropTypes as ButtonPropTypes } from '../UI/Button'

type Colors = ButtonPropTypes['color']
type Confirmation = {
    confirm: boolean,
    text?: string,
}

type FormType = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
type PropTypes<ReturnType> = Omit<FormType, 'action' | 'children'> & {
    children?: ReactNode,
    title?: string,
    submitText?: string,
    submitColor?: Colors,
    confirmation?: Confirmation,
    action: Action<ReturnType>,
    successCallback?: (data?: ReturnType) => void,
    extraContent?: ReactNode,
}
type InputType = {
    input: ReactNode & { label?: string },
    errors: ActionError[],
}
type Inputs = InputType[]


function SubmitButton({
    children,
    generalErrors,
    success,
    color,
    confirmation,
} : {
    children: ReactNode, generalErrors?:
    ActionError[],
    success: boolean,
    color: Colors,
    confirmation: Confirmation,
}) {
    const { pending } = useFormStatus()
    const [confirmedOpen, setConfirmedOpen] = useState(false)

    const btnContent = () => {
        if (pending) {
            return (
                <div className={styles.loader}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            )
        }
        if (success) {
            return (
                <FontAwesomeIcon icon={faCircleCheck} />
            )
        }
        return children
    }
    const button = (
        <Button aria-disabled={pending || success} color={success ? 'green' : color} type="submit">
            {btnContent()}
        </Button>
    )

    const mainContent = () => (confirmedOpen ? (
        <div className={styles.confirm}>
            <p>{confirmation.text || 'Are you sure?'}</p>
            <button className={styles.close} onClick={() => setConfirmedOpen(false)}>
                <FontAwesomeIcon icon={faX} />
            </button>
            {button}
        </div>
    ) : (
        <Button color={color} onClick={() => setConfirmedOpen(true)}>
            {children}
        </Button>
    ))


    return (
        <div className={styles.submit}>
            {
                confirmation.confirm ? (
                    mainContent()
                ) : (
                    button
                )
            }

            <p className={[pending ? styles.pending : ' ', styles.error].join(' ')}>
                {
                    generalErrors && generalErrors[0]?.message
                }
            </p>
        </div>
    )
}

function Input({ input, errors }: InputType) {
    const { pending } = useFormStatus()
    return (
        <span>
            <div className={styles.input}>
                {input}
            </div>
            <p className={[pending ? styles.pending : ' ', styles.error].join(' ')}>
                {
                    errors && errors[0]?.message
                }
            </p>
        </span>
    )
}

const makeInputArray = (children: ReactNode) : Inputs =>
    Children.toArray(children).map((child : ReactNode & { props?: {id?: string} }) => {
        if (typeof child !== 'object') {
            return {
                input: child,
                errors: [],
            }
        }
        return {
            input: { ...child, label: child.props.name || child.props.id },
            errors: [],
        }
    })

export default function Form<GiveActionReturn>({
    children,
    extraContent,
    title,
    submitText = 'create',
    submitColor = 'primary',
    confirmation = {
        confirm: false,
    },
    action,
    successCallback,
    ...props
} : PropTypes<GiveActionReturn>) {
    const [generalErrors, setGeneralErrors] = useState<ActionError[]>()
    const [inputs, setInputs] = useState<Inputs>(makeInputArray(children))
    const [success, setSuccess] = useState(false)

    const actionWithError = async (formData: FormData) => {
        const inputs_ = makeInputArray(children)
        setGeneralErrors(() => undefined)
        setInputs(() => inputs_)

        const { success: successFromAction, data, error: errorFromAction } = await action(formData)

        if (successFromAction) {
            setSuccess(true)
            successCallback?.(data)
            return setTimeout(() => {
                setSuccess(false)
            }, 3000)
        }
        //No error provided
        if (!errorFromAction) {
            return setGeneralErrors([
                {
                    path: [],
                    message: 'error with input'
                }
            ])
        }

        //sort errors
        errorFromAction.forEach(error => {
            if (error.path === undefined) return setGeneralErrors((prev) => (prev ? [...prev, error] : [error]))
            const inputWithError = inputs_.find((input) => input.input.label === (error.path ?? [])[0])
            if (inputWithError) return inputWithError.errors.push(error)
            return setGeneralErrors((prev) => (prev ? [...prev, error] : [error]))
        })
        return setInputs(inputs_)
        
    }

    return (
        <form className={styles.Form} action={actionWithError} {...props}>
            {title && <h2>{title}</h2>}
            {
                inputs.map(({ input, errors }, i) => (
                    <Input input={input} errors={errors} key={i} />
                ))
            }
            {extraContent}
            <SubmitButton
                color={submitColor}
                success={success}
                generalErrors={generalErrors}
                confirmation={confirmation}
            >
                {submitText}
            </SubmitButton>
        </form>
    )
}
