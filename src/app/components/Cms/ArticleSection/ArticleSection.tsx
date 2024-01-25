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

type PropTypes = {
    articleSection: ArticleSection & {
        cmsParagraph: CmsParagraphT | null,
        cmsImage: CmsImageT | null,
        cmsLink: CmsLinkT | null
    }
}

export default function ArticleSection({ articleSection }: PropTypes) {
    const { cmsParagraph, cmsImage, cmsLink } = articleSection
    return (
        <section className={styles.ArticleSection}>
            <AddParts 
                articleSectionName={articleSection.name}
                showParagraphAdd={!cmsParagraph}
                showImageAdd={!cmsImage}
                showLinkAdd={!cmsLink}
            >
                <span className={styles.content}>
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
                        <span className={styles.link}>
                            <div className={styles.remover}>
                                <RemovePart articleSectionName={articleSection.name} part="cmsLink" />
                            </div>
                            <CmsLink cmsLink={cmsLink} />
                        </span>
                    }
                    </div>
                {
                    cmsImage && 
                    <span className={styles.image}>
                        <div className={styles.remover}>
                            <RemovePart articleSectionName={articleSection.name} part='cmsImage' />
                        </div>
                        <CmsImage width={articleSection.imageSize} name={cmsImage.name} />
                    </span>
                }
                </span>
            </AddParts>
        </section>
    );
}