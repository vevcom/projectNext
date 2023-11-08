import React from 'react'
import { ButtonHTMLAttributes } from 'react'

import styles from './PrimaryButton.module.scss'

type PropTypes = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode,
}

export default function PrimaryButton({ children, ...props }:PropTypes) {
    return <button className={styles.Button} {...props}>{ children }</button>
}
