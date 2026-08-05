import styles from './page.module.scss'
import Link from 'next/link'

export default function Locker() {
    return (
        <div className={styles.wrapper}>
            <h3>Skapreservasjoner</h3>
            <Link aria-label={'Opprett ny skaplokasjon'} href={'/admin/lockers/location'}>Opprett ny skaplokasjon</Link>
            <Link aria-label={'Opprett nytt skap'} href={'/admin/lockers/locker'}>Opprett nytt skap</Link>
        </div>
    )
}
