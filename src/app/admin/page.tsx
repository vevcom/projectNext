import styles from './page.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons'

export default function Admin() {
    return (
        <div className={styles.wrapper}>
            <FontAwesomeIcon icon={faScrewdriverWrench} className={styles.icon} />
            <p>Velg en ting å administere i menyen</p>
        </div>
    )
}
