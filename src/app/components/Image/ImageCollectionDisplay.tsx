'use client'
import styles from './ImageCollectionDisplay.module.scss'
import Image from './Image'
import type { ImageCollection, Image as ImageT } from '@prisma/client'
import { Suspense, useRef, useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import useKeyPress from '@/hooks/useKeyPress'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import update from '@/actions/images/update'
import { useRouter } from 'next/navigation'
import destroy from '@/actions/images/destroy'

type ColletionWithImage = ImageCollection & {
    images: ImageT[],
}

type PropTypes = {
    collection: ColletionWithImage,
    startImageName?: string,
    loadMoreImages: () => Promise<ColletionWithImage | null>,
    allLoaded?: boolean,
}

export default function ImageCollectionDisplay({ collection, startImageName, loadMoreImages, allLoaded }: PropTypes) {
    const [currentIndex, setcurrentIndex] = useState(() => collection.images.findIndex(image => image.name === startImageName))
    const currentIndexRef = useRef(currentIndex)
    const collectionLength = useRef(collection.images.length)
    const loop = useRef(allLoaded ?? true)

    useEffect(() => {
        currentIndexRef.current = currentIndex
    }, [currentIndex])

    useEffect(() => {
        collectionLength.current = collection.images.length
    }, [collection])

    useEffect(() => {
        loop.current = allLoaded ?? true
    }, [allLoaded])

    const goLeft = () => {
        setcurrentIndex(prevIndex => (prevIndex - 1 === -1 ? collectionLength.current - 1 : prevIndex - 1))
    }

    const naiveGoRight = () => {
        setcurrentIndex(prevIndex => (prevIndex + 1) % collectionLength.current)
    }
    
    const goRight = async () => {
        if (currentIndexRef.current + 1 === collectionLength.current) {
            if (loop.current) {
                return naiveGoRight()
            } 
            if (!loadMoreImages) {
                loop.current = true
                return naiveGoRight() 
            }
            const data = await loadMoreImages()
            if (!data) return naiveGoRight()
            collectionLength.current += data.images.length
            return naiveGoRight()
        }
        return naiveGoRight()
    }

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
                    <i>{currentIndex}</i>
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
                    <aside className={styles.admin}>
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
                            submitColor='red'
                            confirmation={{
                                confirm: true,
                                text: 'Are you sure you want to delete this image?'
                            }}
                        >
                        </Form>
                    </aside>
                )
            }
        </div>
    )
}
