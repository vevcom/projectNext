import Link from "next/link"
import styles from "./Dropdown.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { v4 as uuid } from 'uuid'
import { IconProp } from "@fortawesome/fontawesome-svg-core"

type PropTypes = {
    name: string,
    items: {
        href: string,
        name: string,
        icon: IconProp,
    }[],
}

function DropDown({ name, items } : PropTypes) {
    return (
        <li className={styles.Dropdown}>
            <div className={styles.name}>{ name }</div>
            <div className={styles.dropdownContent}>
                {items.map(item => 
                    <div className={styles.dropdownItem} key={uuid()}>
                        <Link href={item.href}> 
                            <FontAwesomeIcon className={styles.icon} icon={item.icon} />    
                            <h2 className={styles.linkName}>{item.name}</h2>
                        </Link>
                    </div>
                )}
            </div>
        </li>
    )
}

export default DropDown
