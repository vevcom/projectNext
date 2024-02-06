import styles from './Article.module.scss'
import AddSection from './AddSection'
import SectionMover from './SectionMover'
import CmsImage from '@/cms/CmsImage/CmsImage'
import SlideInOnView from '@/components/SlideInOnView/SlideInOnView'
import ArticleSection from '@/cms/ArticleSection/ArticleSection'
import EditableTextField from '@/components/EditableTextField/EditableTextField'
import { updateArticle } from '@/actions/cms/articles/update'
import type { ReturnType } from '@/cms/articles/ReturnType'

type PropTypes = {
    article: ReturnType,
}

export default function Article({ article } : PropTypes) {
    return (
        <span className={styles.Article}>
            <span className={styles.coverImage}>
                <CmsImage width={500} name={article.coverImage.name} />
                <SlideInOnView direction="bottom">
                    <EditableTextField
                        formProps={
                            {
                                action: updateArticle.bind(null, article.id),
                            }
                        }
                        submitButton={{
                            name: 'name',
                            text: 'lagre',
                            className: styles.submitNameButton
                        }}
                        editable={true}
                    >
                        <h1 className={styles.title}>{article.name}</h1>
                    </EditableTextField>
                </SlideInOnView>
            </span>
            <article>
                {
                    article.articleSections.sort((a, b) => (a.order - b.order)).map((section, i) => (
                        <SlideInOnView direction="left" key={section.id}>
                            <span className={styles.moveSection}>
                                <ArticleSection articleSection={section} />
                                <SectionMover
                                    showUp={i !== 0}
                                    showDown={i !== article.articleSections.length - 1}
                                    articleId={article.id}
                                    sectionId={section.id}
                                    className={styles.moverComponent}
                                />
                            </span>
                        </SlideInOnView>
                    ))
                }
            </article>
            <div className={styles.addSection}>
                <AddSection articleId={article.id} currentNumberSections={article.articleSections.length} />
            </div>
        </span>
    )
}
