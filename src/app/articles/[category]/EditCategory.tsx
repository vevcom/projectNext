import styles from './EditCategory.module.scss'
import Form from '@/app/components/Form/Form'
import PopUp from '@/app/components/PopUp/PopUp'
import Textarea from '@/app/components/UI/Textarea'
import TextInput from '@/app/components/UI/TextInput'
import { updateArticleCategory } from '@/actions/cms/articleCategories/update'
import { createArticleAction } from '@/actions/cms/articles/create'
import { destroyArticleCategoryAction } from '@/actions/cms/articleCategories/destroy'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'

type PropTypes = {
    category: ExpandedArticleCategory
}

export default function EditCategory({ category }: PropTypes) {
    const { refresh, push } = useRouter()
    // Make a visibility check for edit
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

    const updateCategory = updateArticleCategory.bind(null, category.id)

    return (
        <>
            <li className={styles.newArticle}>
                <Form
                    action={createArticleAction.bind(null, null).bind(null, {
                        categoryId: category.id,
                    })}
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
                >
                    <TextInput label="navn" name="name" defaultValue={'hei'} />
                    <Textarea
                        label="beskrivelse"
                        name="description"
                        defaultValue={'hei'}
                        className={styles.description}
                    />
                </Form>
            </PopUp>
            <li>
                <Form
                    action={destroyArticleCategoryAction.bind(null, category.id)}
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
