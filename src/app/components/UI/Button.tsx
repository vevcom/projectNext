import React, { ButtonHTMLAttributes } from 'react'

import styles from './Button.module.scss'

type PropTypes = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode,
    color?: 'primary' | 'secondary' | 'green',
}

export default function Button({ color = 'primary', children, ...props } : PropTypes) {
    return <button className={styles[color]} {...props}>{ children }</button>
}
