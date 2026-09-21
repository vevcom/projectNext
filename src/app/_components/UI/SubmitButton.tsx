import styles from './SubmitButton.module.scss'
import popUpStyles from '@/components/PopUp/PopUp.module.scss'
import Button from '@/components/UI/Button'
import { PopUpContext } from '@/contexts/PopUp'
import React, { useContext, useEffect, useId, useRef, useState } from 'react'
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
    const popUpKey = useId()
    const popUpContext = useContext(PopUpContext)
    // The real submit button must stay inside the <form>'s DOM tree. The popup
    // itself is teleported out to the app-wide PopUpProvider (a sibling of the
    // form, not a descendant), so a submit button rendered there has nothing
    // to submit.
    const realSubmitRef = useRef<HTMLButtonElement>(null)

    const renderButtonContent = (label: ReactNode) => {
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
        return label
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
            {renderButtonContent(children)}
        </Button>
    )

    useEffect(() => {
        if (!popUpContext) return
        if (!confirmedOpen) {
            popUpContext.remove(popUpKey)
            return
        }
        popUpContext.teleport(
            <div className={popUpStyles.PopUp}>
                <div className={popUpStyles.main}>
                    <div className={popUpStyles.overflow}>
                        <button className={popUpStyles.closeBtn} onClick={() => setConfirmedOpen(false)}>
                            <FontAwesomeIcon icon={faX} />
                        </button>
                        <div className={popUpStyles.content}>
                            <p>{confirmation?.text || 'Er du sikker?'}</p>
                            <div className={styles.confirmActions}>
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={() => setConfirmedOpen(false)}
                                >
                                    Nei
                                </Button>
                                <Button
                                    className={`${styles.submitButton} ${className ?? ''}`}
                                    aria-disabled={pending || success}
                                    color={success ? 'green' : color}
                                    type="button"
                                    disabled={disabled || pending || success}
                                    onClick={() => realSubmitRef.current?.click()}
                                >
                                    {renderButtonContent('Ja')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>,
            popUpKey
        )
    }, [confirmedOpen, pending, success, popUpKey])

    return (
        <div className={styles.submit}>
            {
                (confirmation && confirmation.confirm) ? (
                    <>
                        <Button
                            className={`${styles.submitButton} ${className ?? ''}`}
                            color={color}
                            type="button"
                            onClick={() => setConfirmedOpen(true)}
                        >
                            {children}
                        </Button>
                        <button
                            ref={realSubmitRef}
                            type="submit"
                            onClick={onClick}
                            disabled={disabled}
                            aria-hidden="true"
                            tabIndex={-1}
                            className={styles.hiddenSubmit}
                        />
                    </>
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
