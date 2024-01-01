'use client'

import PopUp from '@/components/PopUp/PopUp'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import TextInput from '@/components/UI/TextInput'
import create from '@/actions/images/collections/create'
import Form from '../components/Form/Form'
import { useRouter } from 'next/navigation'
import type { ImageCollection } from '@prisma/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function MakeNewCollection() {
    const router = useRouter()
    const collectionCreatedCallback = (collection?: ImageCollection) => {
        if (collection) router.push(`/images/collections/${collection.id}`)
    }
    return (
        <PopUp showButtonContent={<FontAwesomeIcon icon={faPlus} />}>
            <Form successCallback={collectionCreatedCallback}
                title="Make a collection" submitText="Create collection" action={create}>
                <TextInput label="name" name="name" />
                <TextInput label="description" name="description" />
            </Form>
        </PopUp>
    )
}
