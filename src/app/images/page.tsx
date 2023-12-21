import ImageUploader from '@/components/ImageUploader/ImageUploader'
import prisma from '@/prisma'
import styles from './page.module.scss'
import Link from 'next/link'
import Image from '@/components/Image/Image'

export default async function Images() {
    const collections = await prisma.imageCollection.findMany()
    return (
        <>
            <ImageUploader />
            <div className={styles.wrapper}>
                <h1>Fotogalleri</h1>
                <span className={styles.collections}>
                {
                    collections.map((collection) => (
                        <Link href={`/images/collections/${collection.id}`} className={styles.collection} key={collection.id}>
                            <Image width={100} name="kappemann"></Image>
                            <div className={styles.info}>
                                <h2>{collection.name}</h2>
                                <h4>{collection.description}</h4>
                            </div>            
                        </Link>
                    ))
                }
                </span>
            </div>
        </>
    )
}
