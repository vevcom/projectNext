import Link from "next/link"
import styles from "./DropDown.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function DropDown({ name, items }) {
  return (
    <li className={styles.DropDown}>
        <div className={styles.name}>{ name }</div>
        <div name={name}>
            {items.map(item => 
                <option>
                    <Link href={item.href}>
                        <div>   
                            <FontAwesomeIcon icon={faSearch} />    
                            <h2>{item.name}</h2>
                        </div>
                    </Link>
                </option>
            )}
        </div>
    </li>
  )
}

export default DropDown