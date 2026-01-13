'use client'
import styles from './page.module.scss'
import Form from '@/components/Form/Form'
import TextInput from '@/components/UI/TextInput'
import { destroyFlairAction, readFlairAction, updateFlairAction } from '@/services/flairs/actions'
import FileInput from '@/components/UI/FileInput'
import { unwrapActionReturn } from '@/app/redirectToErrorPage'
import Image from '@/components/Image/Image'
import Button from '@/components/UI/Button'
import { configureAction } from '@/services/configureAction'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { flairImageType } from '@/services/flairs/types'

type routerType = ReturnType<typeof useRouter>

function destroyFlair(id: number, router: routerType) {
    const response = prompt('Er du sikker? (y/n)') //TODO: Better confirmation prompt
    if (response === 'y') {
        destroyFlairAction({ params: { flairId: id } })
    }
    router.push('/flairs/update')
}


export default function FlairUpdatePage() {
    const params = useParams()
    const id = Number(params?.id)
    const [flair, setFlair] = useState<flairImageType | null>(null)
    const router = useRouter()

    useEffect(() => {
        async function loadFlair() {
            const res = unwrapActionReturn(await readFlairAction({ params: { flairId: id } }))
            const flairImage = { ...res, flairId: id }
            setFlair(flairImage)
        }
        loadFlair()
    }, [id])

    if (!flair) {
        return <p>Laster inn...</p>
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div>
                    <h1 className={styles.title}>{flair.name}</h1>
                    <Image width={400} alt={flair.alt} image={flair}></Image>
                    <Form
                        title="Endre på flair"
                        submitText="Oppdater flair"
                        action={configureAction(updateFlairAction, { params: { flairId: flair.flairId } })}>
                        <TextInput label="navn" name="flairName" />
                        <FileInput color="primary" label="bilde" name="file"></FileInput>
                        {/* TODO: Make file upload optional */}
                    </Form>
                    <hr></hr>
                    <Button
                        color={'red'}
                        onClick={() => destroyFlair(flair.flairId, router)}>
                        Slett
                    </Button>
                </div>
            </div>
        </div >)
}
