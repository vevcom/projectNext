import styles from './page.module.scss'
import readLockers from '@/actions/lockers/read'
import readLockerReservations from '@/actions/lockers/reservations/read'
import LockerTable from './LockerTable'
import Form from '../components/Form/Form'
import TextInput from '../components/UI/TextInput'
import NumberInput from '../components/UI/NumberInput'
import Checkbox from '../components/UI/Checkbox'
import { createLockerResorvation } from '@/actions/lockers/reservations/create'

export default async function Skapres() {
    const lockers = await readLockers()
    if (!lockers.success) {
        throw new Error("Kunne ikke hente skapdata")
    }

    const lockerReservations = await readLockerReservations()
    if (!lockerReservations.success) {
        throw new Error("Kunne ikke hente skapresorvasjoner")
    }

    return (
        <div className={styles.wrapper}>
            <h1 className={styles.header}>Skapreservasjon</h1>
            <Form
                title="Reserver skap"
                submitText="Reserver skap"
                action={createLockerResorvation}
            >
                <NumberInput name="lockerId" label="Skap nr."></NumberInput>
                <NumberInput name="userId" label="userId"></NumberInput>
            </Form>
            <LockerTable lockers={lockers.data}></LockerTable>
        </div>
    )
}