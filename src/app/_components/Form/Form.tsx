'use client'
import styles from './Form.module.scss'
import { SUCCESS_FEEDBACK_TIME } from './constants'
import { PopUpContext } from '@/contexts/PopUp'
import SubmitButton from '@/components/UI/SubmitButton'
import React, { Children, useContext, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import type { PopUpKeyType } from '@/contexts/PopUp'
import type { Colors, Confirmation } from '@/components/UI/SubmitButton'
import type { FormHTMLAttributes, ReactNode, DetailedHTMLProps } from 'react'
import type { ActionFormData } from '@/services/actionTypes'
import type { ErrorMessage } from '@/services/error'

type FormType = DetailedHTMLProps<FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>
export type PropTypes<ReturnType> = Omit<FormType, 'action' | 'children'> & {
    children?: ReactNode,
    title?: string,
    submitText?: string,
    submitColor?: Colors,
    confirmation?: Confirmation,
    action: ActionFormData<ReturnType>,
    successCallback?: (data?: ReturnType) => void,
    refreshOnSuccess?: boolean,
    navigateOnSuccess?: string | ((data?: ReturnType) => string | null),
    closePopUpOnSuccess?: PopUpKeyType,
    buttonClassName?: string,
}
type InputType = {
    input: ReactNode & { label?: string },
    errors: ErrorMessage[],
}
type Inputs = InputType[]

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

export default function Form<GiveActionReturn>({
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
    refreshOnSuccess,
    navigateOnSuccess,
    closePopUpOnSuccess,
    buttonClassName,
    ...props
}: PropTypes<GiveActionReturn>) {
    const [generalErrors, setGeneralErrors] = useState<ErrorMessage[]>()
    const [inputs, setInputs] = useState<Inputs>(makeInputArray(children))
    const [success, setSuccess] = useState(false)
    const PopUpCtx = useContext(PopUpContext)
    const { refresh, push } = useRouter()

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
            if (closePopUpOnSuccess) {
                setTimeout(() => {
                    PopUpCtx?.remove(closePopUpOnSuccess)
                }, 2000)
            }
            setTimeout(() => {
                setSuccess(false)
                if (refreshOnSuccess) refresh()
                if (navigateOnSuccess) {
                    if (typeof navigateOnSuccess === 'string') {
                        push(navigateOnSuccess)
                    } else if (typeof navigateOnSuccess === 'function') {
                        const x = navigateOnSuccess(res.data)
                        if (x) push(x)
                    }
                }
            }, SUCCESS_FEEDBACK_TIME)
            return
        }
        //No error provided
        if (!res.error) {
            setGeneralErrors([
                {
                    path: [],
                    message: 'error with input'
                }
            ])
            return
        }

        //sort errors
        res.error.forEach(error => {
            if (error.path === undefined) return setGeneralErrors((prev) => (prev ? [...prev, error] : [error]))
            const inputWithError = inputs_.find((input) => input.input.label === (error.path ?? [])[0])
            if (inputWithError) return inputWithError.errors.push(error)
            return setGeneralErrors((prev) => (prev ? [...prev, error] : [error]))
        })
        setInputs(inputs_)
        return
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        await actionWithError(formData)
    }

    return (
        <form className={`${styles.Form} ${className}`} {...props} onSubmit={handleSubmit}>
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
                className={`${buttonClassName} ${styles.submitButton}`}
            >
                {submitText}
            </SubmitButton>
        </form>
    )
}
