'use client'

import styles from './CreateOmegaquoteFrom.module.scss'
import PopUp from '@/components/PopUp/PopUp'
import Form from '@/components/Form/Form'
import { createQuote } from '@/actions/omegaquotes/create'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/components/UI/Textarea'
import { useRouter } from 'next/navigation'

export default function CreateOmegaquoteForm() {
    const { refresh } = useRouter()

    return (
        <PopUp
            PopUpKey="new_omega_quote"
            showButtonContent="Ny Omegaquote"
            showButtonClass={styles.button}
        >
            <Form title="Ny Omegaquote" submitText="Legg til" action={createQuote} successCallback={refresh} className={styles.popupForm}>
                <Textarea
                    name="quote"
                    label="Omegaquote"
                    placeholder="Omegaquote"
                    className={styles.textarea}
                />
                <TextInput label="Sagt av" name="author" className={styles.author}/>
            </Form>
        </PopUp>
    )
}
