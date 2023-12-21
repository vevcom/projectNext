import ImageUploader from '@/components/ImageUploader/ImageUploader'
import prisma from '@/prisma'
import styles from './page.module.scss'

export default async function Images() {
    const collections = await prisma.imageCollection.findMany()
    return (
        <>
            <ImageUploader />
            <div className={styles.wrapper}>
                <h3>Hvad der har blivet fotografert</h3>
                <span className={styles.collections}>
                {
                    collections.map((collection) => (
                        <div className={styles.collection} key={collection.id}>
                            <h4>{collection.name}</h4>            
                        </div>
                    ))
                }
                </span>
            </div>
        </>
    )
}
