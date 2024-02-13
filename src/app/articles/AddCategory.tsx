'use client'
import Form from '../components/Form/Form'
import TextInput from '../components/UI/TextInput'
import Textarea from '../components/UI/Textarea'
import styles from './AddCategory.module.scss'
import createArticleCategory from '@/actions/cms/articleCategories/create'
import { useRouter } from 'next/navigation'

export default function AddCategory() {
    const { refresh } = useRouter()
    return (
        <Form 
            action={createArticleCategory}
            className={styles.AddCategory}
            successCallback={refresh}
        >
            <TextInput label="Navn" name="name" />
            <Textarea className={styles.description} label="Beskrivelse" name="description" />
        </Form>
    )
}