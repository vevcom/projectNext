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
                            <h3>{collection.name}</h3>            
                        </Link>
                    ))
                }
                </span>
            </div>
        </>
    )
}
