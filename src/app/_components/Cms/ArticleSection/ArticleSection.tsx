import styles from './ArticleSection.module.scss'
import RemovePart from './RemovePart'
import ImageControls from './ImageControls'
import AddPartToArticleSection from './AddPartToArticleSection'
import CmsLink from '@/cms/CmsLink/CmsLink'
import CmsImage from '@/cms/CmsImage/CmsImage'
import CmsParagraph from '@/cms/CmsParagraph/CmsParagraph'
import { configureAction } from '@/services/configureAction'
import type {
    ExpandedArticleSection,
    AddPartToArticleSectionAction,
    RemovePartFromArticleSectionAction,
    UpdateArticleSectionAction
} from '@/cms/articleSections/types'
import type { UpdateCmsParagraphAction } from '@/cms/paragraphs/types'
import type { UpdateCmsImageAction } from '@/cms/images/types'
import type { UpdateCmsLinkAction } from '@/cms/links/types'

type PropTypes = {
    articleSection: ExpandedArticleSection
    actions: {
        updateCmsParagraph: UpdateCmsParagraphAction,
        updateCmsImage: UpdateCmsImageAction,
        updateCmsLink: UpdateCmsLinkAction,
        updateArticleSection: UpdateArticleSectionAction,
        addPartToArticleSection: AddPartToArticleSectionAction,
        removePartFromArticleSection: RemovePartFromArticleSectionAction
    }
}

export type ArticleSectionActions = PropTypes['actions']

export default function ArticleSection({
    articleSection,
    actions
}: PropTypes) {
    const { cmsParagraph, cmsImage, cmsLink } = articleSection

    const cmsImageContent = (
        <span className={styles.image}>
            {cmsImage && <>
                <span className={styles.cmsImageWithControls}>
                    <CmsImage
                        width={articleSection.imageSize}
                        cmsImage={cmsImage}
                        updateCmsImageAction={actions.updateCmsImage}
                    />
                    <ImageControls
                        className={styles.moveControls}
                        articleSection={articleSection}
                        updateArticleSectionAction={actions.updateArticleSection}
                    />
                </span>
                <div className={styles.remover}>
                    <RemovePart
                        part="cmsImage"
                        removePartFromArticleSectionAction={
                            configureAction(
                                actions.removePartFromArticleSection,
                                { params: { articleSectionName: articleSection.name } }
                            )
                        }
                    />
                </div>
            </>
            }
        </span>
    )

    return (
        <section className={styles.ArticleSection}>
            <AddPartToArticleSection
                showParagraphAdd={!cmsParagraph}
                showImageAdd={!cmsImage}
                showLinkAdd={!cmsLink}
                addPartToArticleSectionAction={configureAction(
                    actions.addPartToArticleSection,
                    { params: { articleSectionName: articleSection.name } }
                )}
            >
                <span className={styles.content}>
                    {
                        cmsImage && articleSection.imagePosition === 'LEFT' &&
                        cmsImageContent
                    }
                    <div className={styles.paragraphAndLink}>
                        {
                            cmsParagraph &&
                        <span className={styles.paragraph}>
                            <div className={styles.remover}>
                                <RemovePart
                                    part="cmsParagraph"
                                    removePartFromArticleSectionAction={
                                        configureAction(
                                            actions.removePartFromArticleSection,
                                            { params: { articleSectionName: articleSection.name } }
                                        )
                                    }
                                />
                            </div>
                            <CmsParagraph
                                cmsParagraph={cmsParagraph}
                                className={styles.paragrphComponent}
                                updateCmsParagraphAction={actions.updateCmsParagraph}
                            />
                        </span>
                        }
                        {
                            cmsLink &&
                        <div className={styles.link}>
                            <div className={styles.remover}>
                                <RemovePart
                                    part="cmsLink"
                                    removePartFromArticleSectionAction={
                                        configureAction(
                                            actions.removePartFromArticleSection,
                                            { params: { articleSectionName: articleSection.name } }
                                        )
                                    }
                                />
                            </div>
                            <CmsLink cmsLink={cmsLink} updateCmsLinkAction={actions.updateCmsLink} />
                        </div>
                        }
                    </div>
                    {
                        cmsImage && articleSection.imagePosition === 'RIGHT' &&
                        cmsImageContent
                    }
                </span>
            </AddPartToArticleSection>
        </section>
    )
}
