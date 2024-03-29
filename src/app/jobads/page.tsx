import styles from './page.module.scss'
import PageWrapper from '@/components/PageWrapper/PageWrapper'
import ImageCard from '@/components/ImageCard/ImageCard'
import { readImageAction } from '@/actions/images/read'

export default async function JobAds() {
    const testImageRes = await readImageAction('ohma')
    if (!testImageRes.success) throw new Error('Failed to read image')
    const testImage = testImageRes.data

    return (
        <PageWrapper title="jobbannonser">
            <div className={styles.wrapper}>
                <ImageCard href="/jobads/kongsberg" title="Kongsberg" image={testImage}>
                    <p>Sommerjobb ellerno</p>
                </ImageCard>
            </div>
        </PageWrapper>

    )
}
