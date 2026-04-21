import styles from './page.module.scss'
import Link from 'next/link'

export default function Locker() {
    return (
        <div className={styles.wrapper}>
            <h3>Skapreservasjoner</h3>
            <Link aria-label={'Create new locker location'} href={'/admin/lockers/location'}>Oppret ny skaplokasjon</Link>
            <Link aria-label={'Create new locker'} href={'/admin/lockers/locker'}>Opprett nytt skap</Link>
        </div>
    )
}
