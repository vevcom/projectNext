import ImageUploader from '@/components/ImageUploader/ImageUploader'
import Image from '@/components/Image/Image'

export default function Images() {
    return (
        <>
            <ImageUploader />
            <Image name="ofe" width={300} height={200}/>
        </>
    )
}
