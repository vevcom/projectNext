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
        cmsParagraph: CmsParagraphT,
        cmsImage: CmsImageT,
        cmsLink: CmsLinkT
    }
}

export default function ArticleSection({ articleSection }: PropTypes) {
    return (
        <section className={styles.ArticleSection}>
            <CmsParagraph cmsParagraph={articleSection.cmsParagraph} />
            <CmsImage width={articleSection.imageSize} name={articleSection.cmsImage.name} />
            <CmsLink cmsLink={articleSection.cmsLink} />
        </section>
    );
}