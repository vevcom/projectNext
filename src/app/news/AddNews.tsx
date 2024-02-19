'use client'
import styles from './AddNews.module.scss'
import { createNews } from '@/actions/news/create'
import Form from '@/components/Form/Form'
import { useRouter } from 'next/navigation'
import { ReturnType } from '@/actions/news/ReturnType'
import TextInput from '@/components/UI/TextInput'
import Textarea from '../components/UI/Textarea'

export default function AddNews() {
    const { push } = useRouter()
    const handleCreate = (data?: ReturnType) => {
        push(`/news/${data?.articleName}`)
    }

    return (
        <div className={styles.AddNews}>
            <Form
                action={createNews}
                successCallback={handleCreate}
            >
                <TextInput label="navn" name="name" />
                <Textarea label="beskrivelse" name="description" />
            </Form>
        </div>
    )
}
