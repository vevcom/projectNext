import styles from './CreateInterestGroupForm.module.scss'
import Form from '@/components/Form/Form'
import { createInterestGroupAction } from '@/actions/groups/interestGroups/create'
import TextInput from '@/components/UI/TextInput'

export default function CreateInterestGroupForm() {
    return (
        <div className={styles.CreateInterestGroupForm}>
            <h2>Lag interessegruppe</h2>
            <Form
                refreshOnSuccess
                action={createInterestGroupAction.bind(null, {})}
                submitText="Lag interessegruppe"
            >
                <TextInput name="name" label="Navn" />
                <TextInput name="shortName" label="Kortnavn" />
            </Form>
        </div>
    )
}
