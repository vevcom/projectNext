'use client'
import styles from './CreateDotForm.module.scss'
import { createDotAction } from '@/services/dots/actions'
import Form from '@/components/Form/Form'
import PopUp from '@/components/PopUp/PopUp'
import NumberInput from '@/components/UI/NumberInput'
import TextInput from '@/components/UI/TextInput'
import UserList from '@/components/User/UserList/UserList'
import { useSession } from '@/auth/session/useSession'
import { PopUpContext } from '@/contexts/PopUp'
import { UserSelectionContext } from '@/contexts/UserSelection'
import { configureAction } from '@/services/configureAction'
import { useContext } from 'react'

export default function CreateDotForm() {
    const session = useSession()
    const userSelectionContext = useContext(UserSelectionContext)
    const popUpContext = useContext(PopUpContext)
    if (session.loading) return <>loading...</>
    if (!session.session.user) return <></>
    if (!userSelectionContext) return <></>

    userSelectionContext.onSelection(() => {
        popUpContext?.remove('selectUserDot')
    })

    return (
        <div className={styles.CreateDotForm}>
            <div className={styles.header}>
                <h2>Gi ny prikk</h2>
            </div>
            <div className={styles.userSelected}>
                <p>
                    {
                        userSelectionContext.user ?
                            `${userSelectionContext.user.firstname} ${userSelectionContext.user.lastname}` :
                            'Ingen bruker valgt'
                    }
                </p>
                <PopUp popUpKey="selectUserDot" showButtonClass={styles.openUserList} showButtonContent={
                    <>Velg Bruker</>
                }>
                    <UserList />
                </PopUp>
            </div>
            <Form
                className={styles.form}
                action={configureAction(createDotAction, { params: { accuserId: session.session.user.id } })}
                submitText="Lag prikk"
                refreshOnSuccess
            >
                <TextInput name="reason" label="Grunn" background="raised" />
                <NumberInput name="value" label="Antall prikker" background="raised" />
                <input type="hidden" name="userId" value={userSelectionContext.user?.id} />
            </Form>
        </div>
    )
}
