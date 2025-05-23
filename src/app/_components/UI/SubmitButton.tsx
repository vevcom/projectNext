import styles from './SubmitButton.module.scss'
import Button from '@/components/UI/Button'
import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleCheck, faX } from '@fortawesome/free-solid-svg-icons'
import { useFormStatus } from 'react-dom'
import type { ErrorMessage } from '@/services/error'
import type { ReactNode } from 'react'
import type { PropTypes as ButtonPropTypes } from '@/components/UI/Button'

export type Colors = ButtonPropTypes['color']
export type Confirmation = {
    confirm: boolean,
    text?: string,
}

export default function SubmitButton({
    children,
    generalErrors,
    success,
    color,
    confirmation,
    className,
    pending,
    onClick,
    disabled,
}: {
    children: ReactNode,
    generalErrors?: ErrorMessage[],
    success: boolean,
    color: Colors,
    confirmation?: Confirmation,
    className?: string,
    pending?: boolean,
    onClick?: React.MouseEventHandler<HTMLButtonElement>,
    disabled?: boolean,
}) {
    const formStatus = useFormStatus()
    if (pending === undefined) {
        pending = formStatus.pending
    }

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
            className={`${styles.submitButton} ${className ?? ''}`}
            aria-disabled={pending || success}
            color={success ? 'green' : color}
            type="submit"
            onClick={onClick}
            disabled={disabled}
        >
            {btnContent()}
        </Button>
    )


    const mainContent = () => (confirmedOpen ? (
        <div className={styles.confirm}>
            <p>{confirmation?.text || 'Er du sikker?'}</p>
            <button className={styles.close} onClick={() => setConfirmedOpen(false)}>
                <FontAwesomeIcon icon={faX} />
            </button>
            {button}
        </div>
    ) : (
        <Button className={`${styles.submitButton} ${className ?? ''}`} color={color} onClick={() => setConfirmedOpen(true)}>
            {children}
        </Button>
    ))


    return (
        <div className={styles.submit}>
            {
                (confirmation && confirmation.confirm) ? (
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
