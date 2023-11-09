'use client'

import { useState } from 'react';
import styles from './Popup.module.scss';
import Button from '../UI/Button';

type PropTypes = {  
    children: React.ReactNode
}

export default function Popup({children} : PropTypes) {
    const [show, setShow] = useState(false);
    return (
        show ? (
            <div className={styles.Popup}>
                <Button onClick={() => setShow(false)}>Hide</Button>
                <div className={styles.content}>
                    { children }
                </div>
            </div>
        ) : (
            <Button onClick={() => setShow(true)}>Show</Button>
        )
        
    )
}