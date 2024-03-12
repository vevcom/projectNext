import styles from './CreateCommitteeForm.module.scss'
import Form from "@/app/components/Form/Form";
import TextInput from "@/app/components/UI/TextInput";
import create from "@/actions/groups/committees/create";

/**
 * WARNING: The component expects to be rendered inside a ImageSelectionProvider, so the form can
 * be submitted with a committee logo.
 * A component to create a committee
 * @returns committee form JSX
 */
export default function CreateCommitteeForm() {
    return (
        <div className={styles.CreateCommitteeForm}>
            <Form action={create.bind(null, 1)}>
                <TextInput name="name" label="Navn"/>
            </Form>
        </div>
    )
}
