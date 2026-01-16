import styles from './EditCategory.module.scss'
import Form from '@/components/Form/Form'
import PopUp from '@/components/PopUp/PopUp'
import Textarea from '@/components/UI/Textarea'
import TextInput from '@/components/UI/TextInput'
import {
    updateArticleCategoryAction,
    destroyArticleCategoryAction,
    addArticleToCategoryAction
} from '@/services/articleCategories/actions'
import { configureAction } from '@/services/configureAction'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import type { ExpandedArticleCategory } from '@/services/articleCategories/types'

type PropTypes = {
    category: ExpandedArticleCategory
}

export default function EditCategory({ category }: PropTypes) {
    const { refresh, push } = useRouter()
    // Make a visibility check for edit - no just call the apropriate authorizer.
    const canEditCategory = true

    const handleSuccessDestroy = () => {
        push('/articles')
        refresh()
    }

    const handleSuccessUpdate = (data: ExpandedArticleCategory | undefined) => {
        if (data) {
            push(`/articles/${data.name}`)
        }
        refresh()
    }

    if (!canEditCategory) return null

    const updateCategory = configureAction(
        updateArticleCategoryAction,
        { params: { id: category.id } }
    )

    return (
        <>
            <li className={styles.newArticle}>
                <Form
                    action={configureAction(
                        addArticleToCategoryAction,
                        { params: { id: category.id } }
                    )}
                    successCallback={refresh}
                    submitText="Lag ny artikkel"
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
                    action={updateCategory}
                    successCallback={handleSuccessUpdate}
                    submitText="oppdater"
                >
                    <TextInput label="navn" name="name" defaultValue={category.name} />
                    <Textarea
                        label="beskrivelse"
                        name="description"
                        defaultValue={category.description || ''}
                        className={styles.description}
                    />
                </Form>
            </PopUp>
            <li>
                <Form
                    action={configureAction(
                        destroyArticleCategoryAction,
                        { params: { id: category.id } }
                    )}
                    successCallback={handleSuccessDestroy}
                    submitText="Slett kategori"
                    submitColor="red"
                    confirmation={{
                        confirm: true,
                        text: 'Er du sikker på at du vil slette denne kategorien?',
                    }}
                />
            </li>
        </>
    )
}
