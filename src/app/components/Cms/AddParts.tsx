import styles from './AddParts.module.scss'
import BorderButton from '@/components/UI/BorderButton'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import type { ArticleSectionPart } from '@/server/cms/articleSections/Types'

/**
 * Component for adding parts to an article and article section.
 * Used by two wrapper components: AddSection and AddPartToArticleSection for atricle and article section respectively.
 */

export type PropTypes = {
    showParagraphAdd: boolean,
    showImageAdd: boolean,
    showLinkAdd: boolean
    onClick: (part: ArticleSectionPart) => Promise<void>
}

export default function AddParts({
    showImageAdd,
    showLinkAdd,
    showParagraphAdd,
    onClick
}: PropTypes) {
    const parts: {
        shouldShow: boolean,
        part: ArticleSectionPart,
        text: string
    }[] = [
        {
            shouldShow: showParagraphAdd,
            part: 'cmsParagraph',
            text: 'paragraf'
        },
        {
            shouldShow: showImageAdd,
            part: 'cmsImage',
            text: 'bilde'
        },
        {
            shouldShow: showLinkAdd,
            part: 'cmsLink',
            text: 'link'
        }
    ]

    return (
        <div className={styles.AddParts}>
            {
                parts.map((part, i) => part.shouldShow && (
                    <BorderButton
                        key={i}
                        onClick={() => onClick(part.part)}
                        color="secondary"
                    >
                        <FontAwesomeIcon icon={faPlus} />
                        {part.text}
                    </BorderButton>
                ))
            }
        </div>
    )
}
