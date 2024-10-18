import ArticleSection from '@/components/Cms/ArticleSection/ArticleSection'
import styles from './InterestGroup.module.scss'
import { ExpandedInterestGroup } from '@/services/groups/interestGroups/Types'

type PropTypes = {
    interestGroup: ExpandedInterestGroup
}

export default function InterestGroup({ interestGroup }: PropTypes) {
    return (
        <div className={styles.interestGroup}>
            <h2>{interestGroup.name}</h2>
            <ArticleSection key={interestGroup.id} articleSection={interestGroup.articleSection} />
        </div>
    )
}
