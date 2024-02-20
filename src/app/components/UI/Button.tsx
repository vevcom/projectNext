import styles from './Button.module.scss'
import React from 'react'
import type { ButtonHTMLAttributes } from 'react'


export type PropTypes = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode,
    color?: 'primary' | 'secondary' | 'green' | 'red',
}

export default function Button({ color = 'primary', children, className, ...props }: PropTypes) {
    return <button className={`${styles[color]} ${className}`} {...props}>{ children }</button>
}
