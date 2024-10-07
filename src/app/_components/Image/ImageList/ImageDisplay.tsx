'use client'
import styles from './ImageDisplay.module.scss'
import ImageSelectionButton from './ImageSelectionButton'
import Image, { ImageSizeOptions } from '@/components/Image/Image'
import useKeyPress from '@/hooks/useKeyPress'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { updateImageAction } from '@/actions/images/update'
import { destroyImageAction } from '@/actions/images/destroy'
import { ImagePagingContext } from '@/contexts/paging/ImagePaging'
import { ImageSelectionContext } from '@/contexts/ImageSelection'
import { useRouter } from 'next/navigation'
import { faChevronRight, faChevronLeft, faX, faCog } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ReactEventHandler, useContext } from 'react'
import { ImageDisplayContext } from '@/contexts/ImageDisplayProvider'
import { SelectString } from '../../UI/Select'
import PopUp from '../../PopUp/PopUp'
import { updateImageCollectionAction } from '@/actions/images/collections/update'
import { Image as ImageT } from '@prisma/client'

const mimeTypes: { [key: string]: string } = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    bmp: 'image/bmp',
    webp: 'image/webp',
    avif: 'image/avif',
    tiff: 'image/tiff',
    svg: 'image/svg+xml',
};
const getCurrentType = (image: ImageT, size: ImageSizeOptions) => {
    let src = image.fsLocationOriginal
    switch (size) {
        case 'SMALL':
            src = image.fsLocationSmallSize
            break
        case 'MEDIUM':
            src = image.fsLocationMediumSize
            break
        case 'LARGE':
            src = image.fsLocationLargeSize
            break
        case 'ORIGINAL':
            src = image.fsLocationOriginal
            break
        default:
            return 'unknown'
    }
    const ext = src.split('.').pop()
    if (!ext) return 'unknown'
    return mimeTypes[ext]
} 

export default function ImageDisplay() {
    const pagingContext = useContext(ImagePagingContext)
    const selection = useContext(ImageSelectionContext)
    const displayContext = useContext(ImageDisplayContext)
    const canEdit = true //TODO: Auth

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
                break;
        }
    }

    if (!image) return <></>
    console.log(image)

    return (
        <div className={styles.ImageDisplay}>
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
                <i>Type: {getCurrentType(image, displayContext.imageSize)}</i>
                {
                    pagingContext.loading ? (
                        <div className={styles.loading}></div>
                    ) : (
                        <Image 
                            width={200}
                            imageSize={displayContext.imageSize}
                            image={image} 
                        /> 
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
            {
            canEdit && (
                <PopUp PopUpKey="EditImage" showButtonContent={
                    <div className={styles.openImageAdmin}>
                        <FontAwesomeIcon icon={faCog}/>
                    </div>
                }>
                    <div className={styles.admin}>
                        <Form
                            title="Rediger metadata"
                            successCallback={reload}
                            submitText="oppdater"
                            action={updateImageAction.bind(null, image.id)}
                            closePopUpOnSuccess="EditImage"
                        >
                            <TextInput name="name" label="navn" defaultValue={image.name} />
                            <TextInput name="alt" label="alt" defaultValue={image.alt} />
                        </Form>
                        <Form
                            className={styles.deleteImage}
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
                        <Form
                            className={styles.makeCover}
                            refreshOnSuccess
                            submitText="Gjør til cover"
                            closePopUpOnSuccess="Edit"
                            action={updateImageCollectionAction.bind(null, image.collectionId).bind(null, image.id)}
                        />
                    </div>
                </PopUp>
                )
            }
        </div>
    )
}
