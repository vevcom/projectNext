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
            <Form
                action={createDotAction.bind(null, { accuserId: session.user.id })}
                submitText='Lag prikk'
            >
                <TextInput name="reason" label="Grunn" />
                <NumberInput name="value" label="Antall prikker" />
                <input type="hidden" name="userId" value={userSelectionContext.user?.id} />
            </Form>
            <PopUp PopUpKey="selectUserDot" showButtonContent={
                <>Velg Bruker</>
            }>
                <UserList />
            </PopUp>
        </div>
    )
}
