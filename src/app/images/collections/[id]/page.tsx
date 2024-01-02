import prisma from '@/prisma'
import { notFound } from 'next/navigation'
import styles from './page.module.scss'
import Image from '@/components/Image/Image'
import CollectionAdmin from './CollectionAdmin'
import PopUp from '@/app/components/PopUp/PopUp'
import ImageCollectionDisplay from '@/app/components/Image/ImageCollectionDisplay'
import Button from '@/app/components/UI/Button'
import read from '@/actions/images/collections/read'

type PropTypes = {
    params: {
        id: string
    }
}

export default async function Collection({ params } : PropTypes) {
    const { success, data: collection } = await read(Number(params.id), 20, 0)
    if (!success || !collection) notFound()
    const isAdmin = true //temp

    return (
        <div className={styles.wrapper}>
            {isAdmin &&
            <div className={styles.admin}>
                <CollectionAdmin collectionId={collection.id} />
            </div>
            }
            <div className={styles.images}>
                <h1>{collection.name}</h1>
                <i>{collection.description}</i>
                <span>
                    {
                        collection.images.map(image =>
                            <div key={image.id} className={styles.imageAndBtn}>
                                <Image width={200} image={image} />
                                <PopUp showButtonContent={<></>}>
                                    <ImageCollectionDisplay 
                                        startImageName={image.name} 
                                        collection={collection} 
                                    />
                                </PopUp>
                            </div>
                        )
                    }
                </span>
                <Button>Load more</Button>
            </div>
        </div>
    )
}
