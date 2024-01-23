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
import AddPart from './AddParts';

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
            <AddPart 
                articleSectionName={articleSection.name}
                showParagraphAdd={!cmsParagraph}
                showImageAdd={!cmsImage}
                showLinkAdd={!cmsLink}
            >
            {
                cmsParagraph && 
                <span className={styles.paragraph}>
                    <RemovePart articleSectionName={articleSection.name} part='cmsParagraph' />
                    <CmsParagraph cmsParagraph={cmsParagraph} />
                </span>
            }
            {
                cmsImage && 
                <span className={styles.image}>
                    <RemovePart articleSectionName={articleSection.name} part='cmsImage' />
                    <CmsImage width={articleSection.imageSize} name={cmsImage.name} />
                </span>
            }
            {
                cmsLink && 
                <span className={styles.link}>
                    <RemovePart articleSectionName={articleSection.name} part="cmsLink" />
                    <CmsLink cmsLink={cmsLink} />
                </span>
            }
            </AddPart>
        </section>
    );
}