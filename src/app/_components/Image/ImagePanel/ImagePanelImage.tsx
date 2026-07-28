import styles from './ImagePanelImage.module.scss'
import { default as ImageComponent } from '@/components/Image/Image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import type { Image } from '@/prisma-generated-pn-types'

type PropTypes = {
    image: Image,
    selected: boolean,
    onOpenDisplay?: () => void,
    onToggleSelect?: () => void,
}

/**
 * One image tile in an ImagePanel. Clicking the tile opens the large display when the panel has
 * one, otherwise it toggles selection. The checkmark button always toggles selection when
 * selection is active.
 */
export default function ImagePanelImage({ image, selected, onOpenDisplay, onToggleSelect }: PropTypes) {
    const handleTileClick = onOpenDisplay ?? onToggleSelect

    return (
        <div className={styles.ImagePanelImage}>
            <ImageComponent hideCopyRight width={200} image={image} />
            {handleTileClick && <button className={styles.tileButton} onClick={handleTileClick} />}
            {onToggleSelect && (
                <button
                    onClick={onToggleSelect}
                    className={`${styles.selectButton} ${selected ? styles.selected : ''}`}
                >
                    <FontAwesomeIcon icon={faCheck} />
                </button>
            )}
        </div>
    )
}
