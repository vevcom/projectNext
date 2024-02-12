import { Image as ImageT } from '@prisma/client';
import styles from './ImageCard.module.scss';
import Image from '@/components/Image/Image';

type PropTypes = {
    image: ImageT;
}

export default function ImageCard({ image }: PropTypes) {
    return (
        <div className={styles.ImageCard}>
            ImageCard
            <Image width={200} image={image} />
        </div>
    )
}
