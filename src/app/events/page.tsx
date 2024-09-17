import styles from './page.module.scss'
import CreateEventForm from './CreateEventForm'
import { AddHeaderItemPopUp } from '@/components/HeaderItems/HeaderItemPopUp'

export default function Events() {
    return (
        <div className={styles.wrapper}>
            <h1>Hvad Der Hender</h1>
            <AddHeaderItemPopUp PopUpKey="CreateEventPopUp">
                <div className={styles.createEvent}>
                    <CreateEventForm />
                </div>
            </AddHeaderItemPopUp>
            <ul>
                <li>
                </li>
            </ul>
        </div>
    )
}
