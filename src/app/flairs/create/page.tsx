'use server'

import Form from '@/components/Form/Form'
import styles from './page.module.scss'
import TextInput from '@/components/UI/TextInput'
import { createFlairAction } from '@/services/flairs/actions'
import FileInput from '@/components/UI/FileInput'

export default async function FlairPage() {
    return (
        <div>
            <Form
                title="Lag en flair" submitText="Opprett flair" action={createFlairAction}>
                <TextInput label="navn" name="flairName" />
                <FileInput label="bilde" name="file"></FileInput>
            </Form>
        </div>)
}
