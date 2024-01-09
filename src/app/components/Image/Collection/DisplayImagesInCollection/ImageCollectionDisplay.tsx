'use client'
import styles from './ImageCollectionDisplay.module.scss'
import Image from '../../Image'
import { useContext, useState, useEffect, useRef } from 'react'
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
import { ImageCollectionSelectImageContext } from '@/context/ImageCollectionSelectImage'
import ImageSelectionButton from './ImageSelectionButton'

type PropTypes = {
    startImageName?: string,
}

export default function ImageCollectionDisplay({ startImageName }: PropTypes) {
    const context = useContext(ImagePagingContext)
    const selection = useContext(ImageCollectionSelectImageContext)

    //This component must be rendered inside a ImagePagingContextProvider
    if (!context) throw new Error('No context')

    const images = useRef<ImageT[]>(context?.state.data || [])
    const firstIndex = startImageName ? images.current.findIndex(image => image.name === startImageName) : 0
    const currentImage = useRef<ImageT>(images.current[firstIndex])
    const [currentIndex, setcurrentIndex] = useState(() => images.current.findIndex(image => image.name === startImageName) || 0)
    useEffect(() => {
        images.current = context?.state.data || []
    }, [context.state.data])
    useEffect(() => {
        currentImage.current = images.current[currentIndex]
    }, [currentIndex])


    const goLeft = () => {
        setcurrentIndex(prevIndex => (prevIndex - 1 === -1 ? images.current.length - 1 : prevIndex - 1))
    }

    const naiveGoRight = () => {
        setcurrentIndex(prevIndex => (prevIndex + 1 === images.current.length ? 0 : prevIndex + 1))
    }

    const goRight = async () => {
        if (currentImage.current.id !== images.current[images.current.length - 1].id) return naiveGoRight()
        if (context?.state.allLoaded) return naiveGoRight()
        const newImages = await context.loadMore()
        if (!newImages.length) return naiveGoRight()
        currentImage.current = newImages[0]
        return setcurrentIndex(x => x + 1)
    }

    useKeyPress('ArrowRight', goRight)
    useKeyPress('ArrowLeft', goLeft)

    const isAdmin = true //temp

    const { refresh } = useRouter()

    const reload = async () => {
        images.current = await context.refetch()
        refresh()
    }

    return (
        <div className={styles.ImageCollectionDisplay}>
            <div>
                <div className={styles.currentImage}>
                    <div className={styles.select}>
                        {
                            selection?.selectionMode && (
                                <ImageSelectionButton image={currentImage.current} />
                            )
                        }
                    </div>
                    <h2>{currentImage.current.name}</h2>
                    <i>{currentImage.current.alt}</i>
                    {
                        context?.state.loading ? (
                            <div className={styles.loading}></div>
                        ) : (
                            <Image width={200} image={currentImage.current} />
                        )
                    }
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
                            title="Rediger metadata"
                            successCallback={reload}
                            submitText="oppdater"
                            action={update.bind(null, currentImage.current.id)}
                        >
                            <TextInput name="name" label="navn" />
                            <TextInput name="alt" label="alt" />
                        </Form>
                        <Form
                            successCallback={reload}
                            action={destroy.bind(null, currentImage.current.id)}
                            submitText="slett"
                            submitColor="red"
                            confirmation={{
                                confirm: true,
                                text: 'Er du sikker på at du vil slette bildet?'
                            }}
                        >
                        </Form>
                    </aside>
                )
            }
        </div>
    )
}
