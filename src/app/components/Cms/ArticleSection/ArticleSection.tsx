import styles from './ArticleSection.module.scss'
import RemovePart from './RemovePart'
import ImageControls from './ImageControls'
import AddPartToArticleSection from './AddPartToArticleSection'
import CmsLink from '@/cms/CmsLink/CmsLink'
import CmsImage from '@/cms/CmsImage/CmsImage'
import CmsParagraph from '@/cms/CmsParagraph/CmsParagraph'
import type { ExpandedCmsImage } from '@/cms/images/Types'
import type {
    ArticleSection as ArticleSectionT,
    CmsParagraph as CmsParagraphT,
    CmsLink as CmsLinkT
} from '@prisma/client'

type PropTypes = {
    articleSection: ArticleSectionT & {
        cmsParagraph: CmsParagraphT | null,
        cmsImage: ExpandedCmsImage | null,
        cmsLink: CmsLinkT | null
    }
}

export default function ArticleSection({ articleSection }: PropTypes) {
    const { cmsParagraph, cmsImage, cmsLink } = articleSection

    const cmsImageContent = (
        <span className={styles.image}>
            {cmsImage && <>
                <span className={styles.cmsImageWithControls}>
                    <CmsImage width={articleSection.imageSize} cmsImage={cmsImage} />
                    <ImageControls className={styles.moveControls} articleSection={articleSection} />
                </span>
                <div className={styles.remover}>
                    <RemovePart articleSectionName={articleSection.name} part="cmsImage" />
                </div>
            </>
            }
        </span>
    )

    return (
        <section className={styles.ArticleSection}>
            <AddPartToArticleSection
                articleSectionName={articleSection.name}
                showParagraphAdd={!cmsParagraph}
                showImageAdd={!cmsImage}
                showLinkAdd={!cmsLink}
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
                                <RemovePart articleSectionName={articleSection.name} part="cmsParagraph" />
                            </div>
                            <CmsParagraph cmsParagraph={cmsParagraph} className={styles.paragrphComponent} />
                        </span>
                        }
                        {
                            cmsLink &&
                        <div className={styles.link}>
                            <div className={styles.remover}>
                                <RemovePart articleSectionName={articleSection.name} part="cmsLink" />
                            </div>
                            <CmsLink cmsLink={cmsLink} />
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
