'use client'
import styles from './ImageCollectionDisplay.module.scss'
import Image from '../Image'
import { Suspense, useContext, useState, useEffect, useRef } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import useKeyPress from '@/hooks/useKeyPress'
import Form from '@/app/components/Form/Form'
import TextInput from '@/app/components/UI/TextInput'
import update from '@/actions/images/update'
import { useRouter } from 'next/navigation'
import destroy from '@/actions/images/destroy'
import type { Image as ImageT } from '@prisma/client'
import { ImagePagingContext } from '@/context/paging/ImagePaging'

type PropTypes = {
    startImageName?: string,
}

export default function ImageCollectionDisplay({ startImageName }: PropTypes) {
    const context = useContext(ImagePagingContext)

    //This component must be rendered inside a ImagePagingContextProvider
    if (!context) throw new Error('No context')

    const images = useRef<ImageT[]>(context?.state.data || [])
    useEffect(() => {
        images.current = context?.state.data || []
    }, [context.state.data])
    const [currentIndex, setcurrentIndex] = useState(() => images.current.findIndex(image => image.name === startImageName) || 0)

    const goLeft = () => {
        setcurrentIndex(prevIndex => (prevIndex - 1 === -1 ? images.current.length - 1 : prevIndex - 1))
    }

    const goRight = () => {
        setcurrentIndex(prevIndex => (prevIndex + 1) % images.current.length)
    }

    useKeyPress('ArrowRight', goRight)
    useKeyPress('ArrowLeft', goLeft)

    const isAdmin = true //temp

    const { refresh } = useRouter()

    return (
        <div className={styles.ImageCollectionDisplay}>
            <div>
                <div className={styles.currentImage}>
                    <h2>{images.current[currentIndex].name}</h2>
                    <i>{images.current[currentIndex].alt}</i>
                    <i>{currentIndex}</i>
                    <Suspense fallback={
                        <div className={styles.loading}></div>
                    }>
                        <Image width={200} image={images.current[currentIndex]} />
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
                            action={update.bind(null, images.current[currentIndex].id)}
                        >
                            <TextInput name='name' label='name' />
                            <TextInput name='alt' label='alt' />
                        </Form>
                        <Form
                            successCallback={refresh}
                            action={destroy.bind(null, images.current[currentIndex].id)}
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
