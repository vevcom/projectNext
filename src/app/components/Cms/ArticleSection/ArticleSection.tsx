import styles from './ArticleSection.module.scss'
import CmsParagraph from '../CmsParagraph/CmsParagraph';
import CmsImage from '../CmsImage/CmsImage';
import CmsLink from '../CmsLink/CmsLink';
import type { 
    ArticleSection, 
    CmsParagraph as CmsParagraphT
    , CmsImage as CmsImageT
    , CmsLink as CmsLinkT
} from '@prisma/client';

type PropTypes = {
    articleSection: ArticleSection & {
        cmsParagraph: CmsParagraphT | null,
        cmsImage: CmsImageT | null,
        cmsLink: CmsLinkT | null
    }
}

export default function ArticleSection({ articleSection }: PropTypes) {
    const { cmsParagraph, cmsImage, cmsLink } = articleSection;
    return (
        <section className={styles.ArticleSection}>
            {
                cmsParagraph && 
                <span>
                    <CmsParagraph cmsParagraph={cmsParagraph} />
                </span>
            }
            {
                cmsImage && 
                <span>
                    <CmsImage width={articleSection.imageSize} name={cmsImage.name} />
                </span>
            }
            {
                cmsLink && 
                <span>
                    <CmsLink cmsLink={cmsLink} />
                </span>
            }
        </section>
    );
}