import styles from './Card.module.scss'
import type { ReactNode } from 'react'

type PropTypes = {
    children?: ReactNode,
    heading?: string,
}

export default function Card({ children, heading }: PropTypes) {
    return (
        <div className={styles.Card}>
            {heading && <h2>{heading}</h2>}
            <div>
                {children}
            </div>
        </div>
    )
}
