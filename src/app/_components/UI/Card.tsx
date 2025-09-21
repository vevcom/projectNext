import styles from './Card.module.scss'
import type { ReactNode } from 'react'

type PropTypes = {
    children?: ReactNode,
}

export default function Card({ children }: PropTypes) {
    return (
        <div className={styles.Card}>
            {children}
        </div>
    )
}
