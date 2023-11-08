import { ButtonHTMLAttributes } from 'react'

import styles from './BorderButton.module.scss'

type PropTypes = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode,
    color?: 'primary' | 'secondary',
}

export default function BorderButton({ color = 'primary', children, ...props } : PropTypes) {
    return <button className={styles[color]} {...props}>{ children }</button>
}
