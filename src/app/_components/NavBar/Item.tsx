import styles from './Item.module.scss'
import Link from 'next/link'

type PropTypes = {
    href: string,
    name: string,
}

function Item({ href, name }: PropTypes) {
    return (
        <li>
            <Link href={href} className={styles.link}>
                <div>{name}</div>
            </Link>
        </li>
    )
}

export default Item
