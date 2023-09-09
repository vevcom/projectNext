import Link from "next/link"
import styles from "./Dropdown.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { v4 as uuid } from 'uuid'

function DropDown({ name, items }) {
    return (
        <li className={styles.Dropdown}>
            <div className={styles.name}>{ name }</div>
            <div className={styles.dropdownContent} name={name}>
                {items.map(item => 
                    <div key ={uuid()}>
                        <Link href={item.href}>
                            <div>   
                                <FontAwesomeIcon icon={item.icon} />    
                                <h2>{item.name}</h2>
                            </div>
                        </Link>
                    </div>
                )}
            </div>
        </li>
    )
}

export default DropDown