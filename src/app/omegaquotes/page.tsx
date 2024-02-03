import styles from './page.module.scss'
import PageWrapper from '@/components/PageWrapper/pageWrapper'
import PopUp from '@/components/PopUp/PopUp'
import Form from '@/components/Form/Form'
import create from '@/actions/quotes/create'
import TextInput from '@/components/UI/TextInput'

export default async function OmegaQuotes() {
    return (
        <PageWrapper title="Omega Qutoes" headerItem={
            <PopUp PopUpKey="new_omega_quote" showButtonContent="Ny Omegaquote" showButtonClass={styles.button}>
                <Form title="Ny Omegaquote" submitText="Legg til" action={create}>
                    <TextInput label="Sagt av" name="said_by" />
                </Form>
            </PopUp>
        }>
            <div className={styles.OmegaQuotes}>
                Content
            </div>
        </PageWrapper>
    )
}