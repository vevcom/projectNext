import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import styles from './BurgerItem.module.scss'

function BurgerItem({ href, name, icon }) {
    return (
        <Link href={href} className={styles.BurgerItem}>
            <FontAwesomeIcon icon={icon} className={styles.icon}/>
            <div className={styles.name}>{name}</div>
        </Link>
    )
}

export default BurgerItem