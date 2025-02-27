import styles from './page.module.scss'
import CreateLockerForm from './CreateLockerForm'
import { readAllLockerLocationsAction as readAllLockerLocationsAction } from '@/actions/lockers/location/read'


export default async function Locker() {
    const res = await readAllLockerLocationsAction()
    if (!res.success) throw Error(':(')
    const locations = res.data

    return (
        <div className={styles.wrapper}>
            <CreateLockerForm locations={locations}/>
        </div>
    )
}
