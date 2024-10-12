import { readCommitteeArticleAction } from '@/actions/groups/committees/read'
import styles from './page.module.scss'
import Article from '@/components/Cms/Article/Article'

export type PropTypes = {
    params: {
        shortName: string
    }
}

export default async function committeeArticle({ params }: PropTypes) {
    const committeeArticleRes = await readCommitteeArticleAction(params.shortName)
    if (!committeeArticleRes.success) throw new Error('Kunne ikke hente komitéartikkel')
    const article = committeeArticleRes.data

    return (
        <div className={styles.wrapper}>
            <Article article={article} hideCoverImage noMargin />
        </div>
    )
}
