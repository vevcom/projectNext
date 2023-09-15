import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import styles from './BurgerItem.module.scss'

function BurgerItem({ href, name, icon, shortName }) {
    shortName ??= name;
    return (
        <Link href={href} className={styles.BurgerItem}>
            <FontAwesomeIcon icon={icon} className={styles.icon}/>
            <div className={styles.name}>{name}</div>
            <div className={styles.shortName}>{shortName}</div>
        </Link>
    )
}

export default BurgerItem