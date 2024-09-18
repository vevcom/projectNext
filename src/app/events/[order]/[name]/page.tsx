import { readEvent } from '@/actions/events/read'
import styles from './page.module.scss'
import CmsImage from '@/app/_components/Cms/CmsImage/CmsImage'

type PropTypes = {
    params: {
        order: string,
        name: string
    }
}

export default async function Event({ params }: PropTypes) {
    const res = await readEvent({
        name: decodeURIComponent(params.name),
        order: parseInt(params.order)
    })
    if (!res.success) {
        throw new Error('Failed to read event')
    }
    const event = res.data

    return (
        <div className={styles.wrapper}>
            <span className={styles.coverImage}>
                <CmsImage cmsImage={event.coverImage} width={700} />
            </span>
        </div>
    )
}