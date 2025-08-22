import styles from './page.module.scss'
import { readCommitteeArticleAction } from '@/services/groups/committees/actions'
import Article from '@/components/Cms/Article/Article'

export type PropTypes = {
    params: Promise<{
        shortName: string
    }>
}

export default async function committeeArticle({ params }: PropTypes) {
    const committeeArticleRes = await readCommitteeArticleAction(await params)
    if (!committeeArticleRes.success) throw new Error('Kunne ikke hente komitéartikkel')
    const article = committeeArticleRes.data

    return (
        <div className={styles.wrapper}>
            <Article article={article} hideCoverImage noMargin />
        </div>
    )
}
