'use client'
import Form from '../components/Form/Form'
import TextInput from '../components/UI/TextInput'
import Textarea from '../components/UI/Textarea'
import styles from './AddCategory.module.scss'

export default function AddCategory() {
    return (
        <Form 
            className={styles.AddCategory}
        >
            <TextInput label="Navn" name="name" />
            <Textarea label="Beskrivelse" name="description" />
        </Form>
    )
}