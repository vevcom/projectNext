import styles from './page.module.scss'
import CreateLockerForm from './CreateLockerForm'
import { readLockerLocations } from '@/services/lockers/location/read'


export default async function Locker() {
    const locations = await readLockerLocations()

    return (
        <div className={styles.wrapper}>
            <CreateLockerForm locations={locations}/>
        </div>
    )
}
