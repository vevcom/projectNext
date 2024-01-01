'use client'
import styles from './ImageCollectionDisplay.module.scss'
import Image from './Image'
import type { ImageCollection, Image as ImageT } from '@prisma/client'
import { Suspense, useCallback, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import useKeyPress from '@/hooks/useKeyPress'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import update from '@/actions/images/update'
import { useRouter } from 'next/navigation'
import destroy from '@/actions/images/destroy'

type PropTypes = {
    collection: ImageCollection & {
        images: ImageT[],
    },
    startImageName?: string,
}

export default function ImageCollectionDisplay({ collection, startImageName }: PropTypes) {
    const [currentIndex, setcurrentIndex] = useState(collection.images.findIndex(image => image.name === startImageName))
    const goRight = useCallback(() => {
        setcurrentIndex(prev => (prev + 1) % collection.images.length)
    }, [currentIndex])
    const goLeft = useCallback(() => {
        setcurrentIndex(prev => (prev - 1 === -1 ? collection.images.length - 1 : prev - 1))
    }, [currentIndex])

    useKeyPress('ArrowRight', goRight)
    useKeyPress('ArrowLeft', goLeft)

    const isAdmin = true //temp

    const { refresh } = useRouter()

    return (
        <div className={styles.ImageCollectionDisplay}>
            <div>
                <div className={styles.currentImage}>
                    <h2>{collection.images[currentIndex].name}</h2>
                    <i>{collection.images[currentIndex].alt}</i>
                    <Suspense fallback={
                        <div className={styles.loading}></div>
                    }>
                        <Image width={200} image={collection.images[currentIndex]} />
                    </Suspense>
                </div>

                <div className={styles.controls}>
                    <button onClick={goLeft}>
                        <FontAwesomeIcon icon={faChevronLeft}/>
                    </button>
                    <button onClick={goRight}>
                        <FontAwesomeIcon icon={faChevronRight}/>
                    </button>
                </div>
            </div>
            {
                isAdmin && (
                    <div className={styles.admin}>
                        <Form 
                            title='Edit metadata' 
                            successCallback={refresh} 
                            action={update.bind(null, collection.images[currentIndex].id)}
                        >
                            <TextInput name='name' label='name' />
                            <TextInput name='alt' label='alt' />
                        </Form>
                        <Form
                            successCallback={refresh}
                            action={destroy.bind(null, collection.images[currentIndex].id)}
                            submitText='delete'
                        >
                        </Form>
                    </div>
                )
            }
        </div>
    )
}
