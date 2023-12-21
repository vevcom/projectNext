'use client'

import { useState } from 'react'
import styles from './PopUp.module.scss'
import Button from '../UI/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faX } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

type PropTypes = {
    children: React.ReactNode,
    showButtonIcon: IconProp,
}

export default function PopUp({ children, showButtonIcon } : PropTypes) {
    const [show, setShow] = useState(false)

    const showBtn = (
        <button className={styles.openBtn} onClick={() => setShow(true)}>
            <FontAwesomeIcon icon={showButtonIcon} />
        </button>   
    )
    return (
        show ? (
            <>
            <div className={styles.PopUp}>
                <Button onClick={() => setShow(false)}>
                    <FontAwesomeIcon icon={faX} />
                </Button>
                <div className={styles.content}>
                    { children }
                </div>
            </div>
            {showBtn}
            </>
        ) : (
            showBtn
        )

    )
}