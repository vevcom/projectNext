'use client'
import styles from './Form.module.scss'
import Button from '@/components/UI/Button'
import { Children, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faX } from '@fortawesome/free-solid-svg-icons'
import type { FormHTMLAttributes, ReactNode, DetailedHTMLProps } from 'react'
import type { Action } from '@/actions/Types'
import type { ErrorMessage } from '@/server/error'
import type { PropTypes as ButtonPropTypes } from '@/components/UI/Button'

type Colors = ButtonPropTypes['color']
type Confirmation = {
    confirm: boolean,
    text?: string,
}

type FormType = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
export type PropTypes<ReturnType, DataGuarantee extends boolean> = Omit<FormType, 'action' | 'children'> & {
    children?: ReactNode,
    title?: string,
    submitText?: string,
    submitColor?: Colors,
    confirmation?: Confirmation,
    action: Action<ReturnType, DataGuarantee>,
    successCallback?: (data?: ReturnType) => void,
}
type InputType = {
    input: ReactNode & { label?: string },
    errors: ErrorMessage[],
}
type Inputs = InputType[]


function SubmitButton({
    children,
    generalErrors,
    success,
    color,
    confirmation,
}: {
    children: ReactNode, generalErrors?:
    ErrorMessage[],
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
        <Button
            className={styles.submitButton}
            aria-disabled={pending || success}
            color={success ? 'green' : color}
            type="submit"
        >
            {btnContent()}
        </Button>
    )


    const mainContent = () => (confirmedOpen ? (
        <div className={styles.confirm}>
            <p>{confirmation.text || 'Er du sikker?'}</p>
            <button className={styles.close} onClick={() => setConfirmedOpen(false)}>
                <FontAwesomeIcon icon={faX} />
            </button>
            {button}
        </div>
    ) : (
        <Button className={styles.submitButton} color={color} onClick={() => setConfirmedOpen(true)}>
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

const makeInputArray = (children: ReactNode): Inputs =>
    Children.toArray(children).map((child: ReactNode & { props?: {id?: string} }) => {
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

export default function Form<GiveActionReturn, DataGuarantee extends boolean>({
    children,
    title,
    submitText = 'create',
    submitColor = 'primary',
    confirmation = {
        confirm: false,
    },
    action,
    successCallback,
    className,
    ...props
}: PropTypes<GiveActionReturn, DataGuarantee>) {
    const [generalErrors, setGeneralErrors] = useState<ErrorMessage[]>()
    const [inputs, setInputs] = useState<Inputs>(makeInputArray(children))
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        setInputs(() => makeInputArray(children))
    }, [children])

    const actionWithError = async (formData: FormData) => {
        const inputs_ = makeInputArray(children)
        setGeneralErrors(() => undefined)
        setInputs(() => inputs_)

        const res = await action(formData)

        if (res.success) {
            setSuccess(true)
            successCallback?.(res.data)
            return setTimeout(() => {
                setSuccess(false)
            }, 3000)
        }
        //No error provided
        if (!res.error) {
            return setGeneralErrors([
                {
                    path: [],
                    message: 'error with input'
                }
            ])
        }

        //sort errors
        res.error.forEach(error => {
            if (error.path === undefined) return setGeneralErrors((prev) => (prev ? [...prev, error] : [error]))
            const inputWithError = inputs_.find((input) => input.input.label === (error.path ?? [])[0])
            if (inputWithError) return inputWithError.errors.push(error)
            return setGeneralErrors((prev) => (prev ? [...prev, error] : [error]))
        })
        return setInputs(inputs_)
    }

    return (
        <form className={`${styles.Form} ${className}`} {...props} action={actionWithError}>
            {title && <h2>{title}</h2>}
            {
                inputs.map(({ input, errors }, i) => (
                    <Input input={input} errors={errors} key={i} />
                ))
            }
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
