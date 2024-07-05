import styles from './layout.module.scss'
import React from 'react'
import BackButton from './BackButton'
import SlideSidebar from './SlideSidebar'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
    faBeer, 
    faChild, 
    faKey, 
    faNewspaper, 
    faUser, 
    faUserGroup 
} from '@fortawesome/free-solid-svg-icons'


type PropTypes = {
    children: React.ReactNode
}

export default function AdminLayout({ children }: PropTypes) {
    return (
        <div className={styles.wrapper}>
            <BackButton className={styles.backButton} />
            <SlideSidebar>
                <aside className={styles.sidebar}>
                    <h3><FontAwesomeIcon icon={faUser} />Brukere</h3>
                    <Link href="/admin/users">Brukere</Link>

                    <h3><FontAwesomeIcon icon={faNewspaper} />CMS</h3>
                    <Link href="/admin/cms">Rediger cms</Link>

                    <h3><FontAwesomeIcon icon={faBeer} />Komitéer</h3>
                    <Link href="/admin/committees">Opprett komité</Link>

                    <h3><FontAwesomeIcon icon={faChild} />Opptak</h3>
                    <Link href="/admin/phaestum">Phaestum</Link>
                    <Link href="/admin/admission">Opptak</Link>
                    <Link href="/admin/stateOfOmega">Omegas tilstand</Link>

                    <h3><FontAwesomeIcon icon={faUserGroup} />Grupper</h3>
                    <Link href="/admin/groups">Grupper</Link>
                    <Link href="/admin/classes">Klasser</Link>

                    <h3><FontAwesomeIcon icon={faKey} />Tillgangsstyring</h3>
                    <Link href="/admin/permission-roles">Tillgangsroller</Link>
                    <Link href="/admin/default-permissions">Standard tillganger</Link>
                </aside>
            </SlideSidebar>
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}
