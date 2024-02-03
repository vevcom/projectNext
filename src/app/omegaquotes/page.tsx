import styles from './page.module.scss'
import PageWrapper from '@/components/PageWrapper/pageWrapper'
import PopUp from '@/components/PopUp/PopUp'
import Form from '@/components/Form/Form'
import create from '@/actions/quotes/create'
import TextInput from '@/components/UI/TextInput'
import Textarea from '@/app/components/UI/Textarea'

export default async function OmegaQuotes() {
    return (
        <PageWrapper title="Omega Quotes" headerItem={
            <PopUp PopUpKey="new_omega_quote" showButtonContent="Ny Omegaquote" showButtonClass={styles.button}>
                <Form title="Ny Omegaquote" submitText="Legg til" action={create} className={styles.popupForm}>
                    <Textarea label="Omegaquote" placeholder="Omegaquote" className={styles.textarea}></Textarea>
                    <TextInput label="Sagt av" name="said_by" className={styles.said_by}/>
                </Form>
            </PopUp>
        }>
            <div className={styles.OmegaQuotes}>
                Content
            </div>
        </PageWrapper>
    )
}