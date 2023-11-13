import Image from '@/app/components/Image/Image/Image'
import TextInput from '../../UI/TextInput'
import update from '@/actions/images/update'
import styles from './ImageEditor.module.scss'
import Button from '@/UI/Button'

type PropTypes = {
    image: {
        name: string,
        alt: string,
    }
}

export default function ImageEditor({ image } : PropTypes) {
    return (
        <div className={styles.ImageEditor}>
            <h3>Edit: {image.name}</h3>
            <form action={update.bind(null, image.name)}>
                <TextInput name="name" label="name" defaultValue={image.name}/>
                <TextInput name="alt" label="alt" defaultValue={image.alt}/>
                <input name="file" type="file" />
                <Button type="submit" value="Upload">Change</Button>
            </form>
            <Image showEditOption={false} width={200} name={image.name}>
            </Image>
        </div>
    )
}
