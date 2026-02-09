import styles from './ProfileButton.module.scss'
import React from 'react'
import Link from 'next/link'
import type { ButtonHTMLAttributes } from 'react'


export type PropTypes = ButtonHTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode,
    href: string,
}

export default function ProfileButton({ children, href }: PropTypes) {
    return <Link className={styles.button} href={href}>{ children }</Link>
}
