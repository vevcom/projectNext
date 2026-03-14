import styles from './ProfileButton.module.scss'
import React from 'react'
import Link, { type LinkProps } from 'next/link'

export type ProfileButtonProps = LinkProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    children: React.ReactNode,
}

export default function ProfileButton({ children, ...props }: ProfileButtonProps) {
    return <Link className={styles.button} {...props}>{ children }</Link>
}
