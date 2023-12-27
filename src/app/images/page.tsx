import prisma from '@/prisma'
import styles from './page.module.scss'
import Link from 'next/link'
import Image from '@/components/Image/Image'
import PopUp from '@/components/PopUp/PopUp'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import TextInput from '@/components/UI/TextInput'
import create from '@/actions/images/collections/create'
import Form from '../components/Form/Form'
import type { ImageCollection } from '@prisma/client'

export default async function Images() {
    const isAdmin = true //temp

    const collections = await prisma.imageCollection.findMany({
        include: {
            coverImage: true,
            images: {
                take: 1
            }
        }
    })

    const findCoverImageToUse = (collection : {
        coverImage: {name: string} | null,
        images: {name: string}[]
    }) => {
        if (collection.coverImage) return collection.coverImage.name
        if (collection.images.length > 0) return collection.images[0].name
        return "lens_camera"
    }

    const collectionCreatedCallback = (collection?: object) => {
       
    }

    return (
        <>
            <div className={styles.wrapper}>
                <span className={styles.header}>
                    <h1>Fotogalleri</h1>
                    {isAdmin &&
                        <PopUp showButtonIcon={faPlus}> 
                            <Form successCallback={collectionCreatedCallback} 
                                title='Make a collection' createText='Create collection' action={create}>
                                <TextInput label="name" name="name" />
                                <TextInput label="description" name="description" />
                            </Form>
                        </PopUp>
                    }
                </span>
                {
                    collections.map(collection => (
                        <Link href={`/images/collections/${collection.id}`} className={styles.collection} key={collection.id}>
                            <Image width={100} name={findCoverImageToUse(collection)} />
                            <div className={styles.info}>
                                <h2>{collection.name}</h2>
                                <h4>{collection.description}</h4>
                            </div>            
                        </Link>
                    ))
                }
            </div>
        </>
    )
}
