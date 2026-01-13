'use server'
import styles from './page.module.scss'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { createFlairAction } from '@/services/flairs/actions'
import FileInput from '@/components/UI/FileInput'

export default async function FlairCreatePage() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <Form
                    title="Lag en flair" submitText="Opprett flair" action={createFlairAction}>
                    <TextInput label="navn" name="flairName" />
                    <FileInput color="primary" label="bilde" name="file"></FileInput>
                </Form>
            </div>
        </div >)
}
