import styles from './ArticleSection.module.scss'
import CmsParagraph from '../CmsParagraph/CmsParagraph';
import CmsImage from '../CmsImage/CmsImage';
import CmsLink from '../CmsLink/CmsLink';
import type { 
    ArticleSection, 
    CmsParagraph as CmsParagraphT, 
    CmsImage as CmsImageT, 
    CmsLink as CmsLinkT
} from '@prisma/client';
import RemovePart from './RemovePart';
import AddParts from './AddParts';
import ImageControls from './ImageControls';

type PropTypes = {
    articleSection: ArticleSection & {
        cmsParagraph: CmsParagraphT | null,
        cmsImage: CmsImageT | null,
        cmsLink: CmsLinkT | null
    }
}

export default function ArticleSection({ articleSection }: PropTypes) {
    const { cmsParagraph, cmsImage, cmsLink } = articleSection

    const cmsImageContent =  (
        <ImageControls>
            <span className={styles.image}>
                <div className={styles.remover}>
                    <RemovePart articleSectionName={articleSection.name} part='cmsImage' />
                </div>
                {cmsImage &&<CmsImage width={articleSection.imageSize} name={cmsImage.name} />}
            </span>
        </ImageControls>
    )   

    return (
        <section className={styles.ArticleSection}>
            <AddParts 
                articleSectionName={articleSection.name}
                showParagraphAdd={!cmsParagraph}
                showImageAdd={!cmsImage}
                showLinkAdd={!cmsLink}
            >
                <span className={styles.content}>
                {
                    cmsImage && articleSection.imagePosition === "LEFT" && 
                        cmsImageContent
                }
                    <div className={styles.paragraphAndLink}>
                    {
                        cmsParagraph && 
                        <span className={styles.paragraph}>
                            <div className={styles.remover}>
                                <RemovePart articleSectionName={articleSection.name} part='cmsParagraph' />
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
                    cmsImage && articleSection.imagePosition === "RIGHT" && 
                        cmsImageContent
                }
                </span>
            </AddParts>
        </section>
    );
}