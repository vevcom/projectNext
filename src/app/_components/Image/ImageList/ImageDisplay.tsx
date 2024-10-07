'use client'
import styles from './ImageDisplay.module.scss'
import ImageSelectionButton from './ImageSelectionButton'
import Image from '@/components/Image/Image'
import useKeyPress from '@/hooks/useKeyPress'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { updateImageAction } from '@/actions/images/update'
import { destroyImageAction } from '@/actions/images/destroy'
import { ImagePagingContext } from '@/contexts/paging/ImagePaging'
import { ImageSelectionContext } from '@/contexts/ImageSelection'
import useEditing from '@/hooks/useEditing'
import { useRouter } from 'next/navigation'
import { faChevronRight, faChevronLeft, faX } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { use, useContext } from 'react'
import { ImageDisplayContext } from '@/contexts/ImageDisplayProvider'
import { SelectString } from '../../UI/Select'

type PropTypes = {
    disableEditing?: boolean,
}

export default function ImageDisplay({ disableEditing = false }: PropTypes) {
    const pagingContext = useContext(ImagePagingContext)
    const selection = useContext(ImageSelectionContext)
    const displayContext = useContext(ImageDisplayContext)
    const canEdit = useEditing({}) //TODO: auth

    if (!pagingContext || !displayContext) throw new Error('No context')
    
    const getCurrentIndex = () => {
        return pagingContext.state.data.findIndex(x => x.id === displayContext.currentImage?.id)
    }
    
    const goLeft = () => {
        const currentIndex = getCurrentIndex()
        const nextIndex = currentIndex === 0 ? pagingContext.state.data.length - 1 : currentIndex - 1
        displayContext.setImage(pagingContext.state.data[nextIndex])
    }

    const naiveGoRight = () => {
        const currentIndex = getCurrentIndex()
        const nextIndex = currentIndex === pagingContext.state.data.length - 1 ? 0 : currentIndex + 1
        displayContext.setImage(pagingContext.state.data[nextIndex])
    }

    const goRight = async () => {
        if (!pagingContext.state.data.length) return
        if (!displayContext.currentImage) {
            pagingContext.state.data.length ?? displayContext.setImage(pagingContext.state.data[0])
            return
        }
        if (displayContext.currentImage.id !== pagingContext.state.data[pagingContext.state.data.length - 1].id) {
            return naiveGoRight()
        }
        if (pagingContext.state.allLoaded) return naiveGoRight()
        const newImages = await pagingContext.loadMore()
        if (!newImages.length) return naiveGoRight()
        displayContext.setImage(newImages[0])
    }

    useKeyPress('ArrowRight', goRight)
    useKeyPress('ArrowLeft', goLeft)

    const { refresh } = useRouter()

    const reload = async () => {
        pagingContext.refetch()
        refresh()
    }

    const image = displayContext.currentImage

    const close = () => {
        displayContext.setImage(null)
    }
    useKeyPress('Escape', close)

    const handleSizeChange = (size: string) => {
        switch (size) {
            case 'SMALL':
                displayContext.setImageSize('SMALL')
                break
            case 'MEDIUM':
                displayContext.setImageSize('MEDIUM')
                break
            case 'LARGE':
                displayContext.setImageSize('LARGE')
                break
            case 'ORIGINAL':
                displayContext.setImageSize('ORIGINAL')
                break
            default:
                throw new Error('Invalid size')
        }
    }

    if (!image) return <></>

    return (
        <div className={styles.ImageDisplay}>
            <div>
                <div className={styles.selectImageSize}>
                    <SelectString 
                        defaultValue={displayContext.imageSize} 
                        value={displayContext.imageSize}
                        onChange={handleSizeChange} 
                        name="imageSize" 
                        label="Oppløsning" 
                        options={[
                            {
                                label: 'Liten',
                                value: 'SMALL'
                            },
                            {
                                label: 'Middels',
                                value: 'MEDIUM'
                            },
                            {
                                label: 'Stor',
                                value: 'LARGE'
                            },
                            {
                                label: 'Original',
                                value: 'ORIGINAL'
                            }
                    ]}/>
                </div>
                <button onClick={close} className={styles.close}>
                    <FontAwesomeIcon icon={faX}/>
                </button>
                <div className={styles.currentImage}>
                    <div className={styles.select}>
                        {
                            selection?.selectionMode && (
                                <ImageSelectionButton image={image} />
                            )
                        }
                    </div>
                    <h1>{image.name}</h1>
                    <i>{image.alt}</i>
                    {
                        pagingContext.loading ? (
                            <div className={styles.loading}></div>
                        ) : (
                            <Image width={200} imageSize={displayContext.imageSize} image={image} />
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
                (canEdit && !disableEditing) && (
                    <aside className={styles.admin}>
                        <Form
                            title="Rediger metadata"
                            successCallback={reload}
                            submitText="oppdater"
                            action={updateImageAction.bind(null, image.id)}
                        >
                            <TextInput name="name" label="navn" />
                            <TextInput name="alt" label="alt" />
                        </Form>
                        <Form
                            successCallback={reload}
                            action={destroyImageAction.bind(null, image.id)}
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
