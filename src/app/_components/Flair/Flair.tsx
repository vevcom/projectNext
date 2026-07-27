import styles from './Flair.module.scss'
import Image from '@/components/Image/Image'
import type { FlairWithImage } from '@/services/flairs/types'

type PropTypes = {
    flair: FlairWithImage,
    width?: number,
}

export default function Flair({ flair, width = 50 }: PropTypes) {
    return (
        <div className={styles.Flair}>
            <Image image={flair.image} width={width} />
        </div>
    )
}
