import Link from "next/link"

import styles from "./Item.module.scss"

function Item({ href, name }) {
    return (
        <li>
            <Link href={href} className={styles.link}>
                <div>{name}</div>
            </Link>
        </li>
    )
}

export default Item