'use client'

import PopUp from '@/components/PopUp/PopUp'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import TextInput from '@/components/UI/TextInput'
import create from '@/actions/images/collections/create'
import Form from '../components/Form/Form'
import { useRouter } from 'next/navigation'
import type { ImageCollection } from '@prisma/client'

export default function MakeNewCollection() {
    const router = useRouter()
    const collectionCreatedCallback = (collection?: ImageCollection) => {
        console.log(collection)
        if (collection) router.push(`/images/collections/${collection.id}`)
    }
    return (
        <PopUp showButtonIcon={faPlus}>
            <Form successCallback={collectionCreatedCallback}
                title="Make a collection" createText="Create collection" action={create}>
                <TextInput label="name" name="name" />
                <TextInput label="description" name="description" />
            </Form>
        </PopUp>
    )
}
