'use client'

import { useState } from 'react'
import styles from './PopUp.module.scss'
import Button from '../UI/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'
import React from 'react'

type PropTypes = {
    children: React.ReactNode,
    showButtonContent: React.ReactNode,
}

export default function PopUp({ children, showButtonContent } : PropTypes) {
    const [show, setShow] = useState(false)

    const showBtn = (
        <button className={styles.openBtn} onClick={() => setShow(true)}>
            {showButtonContent}
        </button>
    )
    return (
        show ? (
            <>
                <div className={styles.PopUp}>
                    <div>
                        <Button className={styles.closeBtn} onClick={() => setShow(false)}>
                            <FontAwesomeIcon icon={faX} />
                        </Button>
                        <div className={styles.content}>
                            { children }
                        </div>
                    </div>
                </div>
                {showBtn}
            </>
        ) : (
            showBtn
        )

    )
}
