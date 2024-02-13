import Form from '@/app/components/Form/Form'
import styles from './EditCategory.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import PopUp from '@/app/components/PopUp/PopUp'
import Textarea from '@/app/components/UI/Textarea'
import TextInput from '@/app/components/UI/TextInput'
import { ReturnType } from '@/actions/cms/articleCategories/ReturnType'
import { updateArticleCategory } from '@/actions/cms/articleCategories/update'
import { createArticle } from '@/actions/cms/articles/create'
import { useRouter } from 'next/navigation'

type PropTypes = {
    category: ReturnType
}

export default function EditCategory({ category }: PropTypes) {
    const { refresh } = useRouter()
    // Make a visibility check for edit
    const canEditCategory = true

    if (!canEditCategory) return null

    return (
        <>
        <li className={styles.newArticle}>
            <Form
                action={createArticle.bind(null, null).bind(null, {
                    categoryId: category.id,
                })}
                successCallback={refresh}
                submitText='Lag ny artikkel'
            />
        </li>
        <PopUp
            PopUpKey="editCategory"
            showButtonClass={styles.openEditCategory}
            showButtonContent={
                <FontAwesomeIcon icon={faCog} />
            }
        >
            <Form
                className={styles.EditCategory}
                action={updateArticleCategory.bind(null, category.id)}
            >
                <TextInput label="navn" name="name" defaultValue={"hei"} />
                <Textarea 
                    label="beskrivelse" 
                    name="description" 
                    defaultValue={"hei"} 
                    className={styles.description}
                />
            </Form>
        </PopUp>
        <li>
            <Form
                action={createArticle.bind(null, null).bind(null, {
                    categoryId: category.id,
                })}
                successCallback={refresh}
                submitText='Slett kategori'
                submitColor='red'
                confirmation={{
                    confirm: true,
                    text: 'Er du sikker på at du vil slette denne kategorien?',
                }}
            />
        </li>
        </>
    )
}
