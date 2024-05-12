import styles from './page.module.scss'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBeer, faChild, faKey, faNewspaper, faUser, faPaperPlane } from '@fortawesome/free-solid-svg-icons'

export default function Admin() {
    return (
        <div className={styles.wrapper}>
            <h2>Administrasjon</h2>

            <h3><FontAwesomeIcon icon={faUser} />Brukere</h3>
            <Link href="admin/users">Brukere</Link>

            <h3><FontAwesomeIcon icon={faNewspaper} />CMS</h3>
            <Link href="admin/cms">Rediger cms</Link>

            <h3><FontAwesomeIcon icon={faBeer} />Komitéer</h3>
            <Link href="admin/committees">Opprett komité</Link>

            <h3><FontAwesomeIcon icon={faChild} />Opptak</h3>
            <Link href="admin/phaestum">Phaestum</Link>

            <h3><FontAwesomeIcon icon={faKey} />Tillgangsstyring</h3>
            <Link href="admin/permission-roles">Tillgangsroller</Link>
            <Link href="admin/default-permissions">Standard tillganger</Link>

            <h3><FontAwesomeIcon icon={faPaperPlane} />Varslinger</h3>
            <Link href="admin/sendnotification">Send varsel</Link>
            <Link href="admin/notificationchannels">Varslingkanaler</Link>
            <Link href="admin/mail">Mailing lister</Link>
            <Link href="admin/sendmail">Send epost</Link>

        </div>
    )
}
