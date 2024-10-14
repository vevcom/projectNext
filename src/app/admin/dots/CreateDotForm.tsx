'use client'
import { createDotAction } from "@/actions/dots/create"
import Form from "@/app/_components/Form/Form"
import PopUp from "@/app/_components/PopUp/PopUp"
import NumberInput from "@/app/_components/UI/NumberInput"
import TextInput from "@/app/_components/UI/TextInput"
import UserList from "@/app/_components/User/UserList/UserList"
import { useUser } from "@/auth/useUser"
import { PopUpContext } from "@/contexts/PopUp"
import { UserSelectionContext } from "@/contexts/UserSelection"
import { useContext } from "react"
import styles from './CreateDotForm.module.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from "@fortawesome/free-solid-svg-icons"

export default function CreateDotForm() {
    const session = useUser()
    const userSelectionContext = useContext(UserSelectionContext)
    const popUpContext = useContext(PopUpContext)
    if (!session.user) return <></>
    if (!userSelectionContext) return <></>

    userSelectionContext.onSelection(() => {
        popUpContext?.remove('selectUserDot')
    })

    return (
        <div className={styles.CreateDotForm}>
            <FontAwesomeIcon icon={faPlus} />
            <h2>
                Lag ny prikk
            </h2>
            <div className={styles.userSelected}>
                <p>
                {
                    userSelectionContext.user ? 
                    `${userSelectionContext.user.firstname} ${userSelectionContext.user.lastname}` : 
                    'ingen bruker valgt'
                }
                </p>
                <PopUp PopUpKey="selectUserDot" showButtonClass={styles.openUserList} showButtonContent={
                    <>Velg Bruker</>
                }>
                    <UserList />
                </PopUp>
            </div>
            <Form
                action={createDotAction.bind(null, { accuserId: session.user.id })}
                submitText='Lag prikk'
            >
                <TextInput name="reason" label="Grunn" />
                <NumberInput name="value" label="Antall prikker" />
                <input type="hidden" name="userId" value={userSelectionContext.user?.id} />
            </Form>
        </div>
    )
}
