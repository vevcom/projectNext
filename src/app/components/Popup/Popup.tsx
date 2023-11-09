'use client'

import { useState } from 'react'
import styles from './Popup.module.scss'
import Button from '../UI/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { faX } from '@fortawesome/free-solid-svg-icons'

type PropTypes = {  
    children: React.ReactNode,
    showButtonIcon: IconProp,
}

export default function Popup({children, showButtonIcon} : PropTypes) {
    const [show, setShow] = useState(false);
    return (
        show ? (
            <div className={styles.Popup}>
                <Button onClick={() => setShow(false)}>
                    <FontAwesomeIcon icon={faX} />
                </Button>
                <div className={styles.content}>
                    { children }
                </div>
            </div>
        ) : (
            <Button onClick={() => setShow(true)}>
                <FontAwesomeIcon icon={showButtonIcon} />
            </Button>
        )
        
    )
}