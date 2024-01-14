import styles from './Button.module.scss'
import React, { ButtonHTMLAttributes } from 'react'


export type PropTypes = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode,
    color?: 'primary' | 'secondary' | 'green' | 'red',
}

export default function Button({ color = 'primary', children, ...props } : PropTypes) {
    return <button className={styles[color]} {...props}>{ children }</button>
}
