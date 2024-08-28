import { readApiKeyAction } from '@/actions/api-keys/read'

type PropTypes = {
    params: {
        name: string
    }
}

export default async function ApiKeyAdmin({ params }: PropTypes) {
    const res = await readApiKeyAction(decodeURIComponent(params.name))
    if (!res.success) throw new Error(res.error?.length ? res.error[0].message : 'En feil har oppstått')
    const apiKey = res.data

    return (
        <div>
            <h1>{apiKey.name}</h1>
            <i>{apiKey.active ? 'AKTIV' : 'INAKTIV'}</i>
            <p>Utgår: {apiKey.expiresAt?.toDateString()}</p>
            <p>Opprettet: {apiKey.createdAt.toDateString()}</p>
            <p>Sist oppdatert: {apiKey.updatedAt.toDateString()}</p>
        </div>
    )
}
