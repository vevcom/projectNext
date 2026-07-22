'use client'
import { readDefaultPermissionsAction } from '@/services/permissions/actions'
import { readAllStandardImagesAction } from '@/services/images/standard/actions'
import { readGroupsExpandedAction } from '@/services/groups/actions'
import { specialImagePanelAuth } from '@/services/images/specialPanels/auth'
import {
    readStandardImagesCollectionAction,
    readProfileImagesCollectionAction,
    readCommitteeLogosCollectionAction,
    readOmbulCoversCollectionAction,
    readFlairImagesCollectionAction,
} from '@/services/images/specialPanels/actions'
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { ErrorCode } from '@/services/error'
import type { ExpandedGroup } from '@/services/groups/types'
import type { ExpandedImageCollection } from '@/services/images/subservice/types'
import type { Image, Permission, StandardImage } from '@/prisma-generated-pn-types'
import type { ReactNode } from 'react'
import type { SessionMaybeUser } from '@/auth/session/Session'

const specialCollectionSources = [
    { auth: specialImagePanelAuth.standardImages, read: readStandardImagesCollectionAction },
    { auth: specialImagePanelAuth.profileImages, read: readProfileImagesCollectionAction },
    { auth: specialImagePanelAuth.committeeLogos, read: readCommitteeLogosCollectionAction },
    { auth: specialImagePanelAuth.ombulCovers, read: readOmbulCoversCollectionAction },
    { auth: specialImagePanelAuth.flairImages, read: readFlairImagesCollectionAction },
] as const

type ClientDataResult<Key extends string, Data> =
    | { status: 'loading' }
    | { status: 'error', errorCode: ErrorCode }
    | ({ status: 'success' } & { [P in Key]: Data })

type ClientDataContext = {
    defaultPermissions: ClientDataResult<'defaultPermissions', Permission[]> | null,
    standardImages: ClientDataResult<'standardImages', Record<StandardImage, Image>> | null,
    groups: ClientDataResult<'groups', ExpandedGroup[]> | null,
    specialCollections: ClientDataResult<'specialCollections', ExpandedImageCollection[]> | null,
    loadDefaultPermissions: () => void,
    loadStandardImages: () => void,
    loadGroups: () => void,
    loadSpecialCollections: () => void,
}

const ClientDataContext = createContext<ClientDataContext | null>(null)

type PropTypes = {
    children: ReactNode,
    session: SessionMaybeUser,
    defaultPermissions?: Permission[],
    standardImages?: Record<StandardImage, Image>,
    groups?: ExpandedGroup[],
    specialCollections?: ExpandedImageCollection[],
}

/**
 * The single client-side cache for shared server data. Main Layout may seed
 * the cach from server-side data, but the cache will be updated on the client side as needed.
 */
export default function ClientDataProvider({
    children,
    session,
    ...initialData
}: PropTypes) {
    const [defaultPermissions, setDefaultPermissions] = useState<
        ClientDataResult<'defaultPermissions', Permission[]> | null
    >(
        initialData.defaultPermissions
            ? { status: 'success', defaultPermissions: initialData.defaultPermissions }
            : null
    )
    const [standardImages, setStandardImages] = useState<
        ClientDataResult<'standardImages', Record<StandardImage, Image>> | null
    >(
        initialData.standardImages
            ? { status: 'success', standardImages: initialData.standardImages }
            : null
    )
    const [groups, setGroups] = useState<
        ClientDataResult<'groups', ExpandedGroup[]> | null
    >(
        initialData.groups
            ? { status: 'success', groups: initialData.groups }
            : null
    )
    const [specialCollections, setSpecialCollections] = useState<
        ClientDataResult<'specialCollections', ExpandedImageCollection[]> | null
    >(
        initialData.specialCollections
            ? { status: 'success', specialCollections: initialData.specialCollections }
            : null
    )

    const loadDefaultPermissions = useCallback(async () => {
        setDefaultPermissions({ status: 'loading' })
        const res = await readDefaultPermissionsAction()
        setDefaultPermissions(
            res.success
                ? { status: 'success', defaultPermissions: res.data }
                : { status: 'error', errorCode: res.errorCode }
        )
    }, [])

    const loadStandardImages = useCallback(async () => {
        setStandardImages({ status: 'loading' })
        const res = await readAllStandardImagesAction()
        setStandardImages(
            res.success
                ? { status: 'success', standardImages: res.data }
                : { status: 'error', errorCode: res.errorCode }
        )
    }, [])

    const loadGroups = useCallback(async () => {
        setGroups({ status: 'loading' })
        const res = await readGroupsExpandedAction()
        setGroups(
            res.success
                ? { status: 'success', groups: res.data }
                : { status: 'error', errorCode: res.errorCode }
        )
    }, [])

    const loadSpecialCollections = useCallback(async () => {
        setSpecialCollections({ status: 'loading' })
        const authorizedSources = specialCollectionSources.filter(
            source => source.auth.dynamicFields({}).auth(session).authorized
        )
        const results = await Promise.all(authorizedSources.map(source => source.read()))
        setSpecialCollections({
            status: 'success',
            specialCollections: results.flatMap(res => (res.success ? [res.data] : [])),
        })
    }, [session])

    return (
        <ClientDataContext.Provider value={{
            defaultPermissions,
            standardImages,
            groups,
            specialCollections,
            loadDefaultPermissions,
            loadStandardImages,
            loadGroups,
            loadSpecialCollections,
        }}>
            {children}
        </ClientDataContext.Provider>
    )
}

function useClientData(): ClientDataContext {
    const context = useContext(ClientDataContext)
    if (!context) throw new Error('ClientData hooks must be used within a ClientDataProvider')
    return context
}

export function useDefaultPermissions(): ClientDataResult<'defaultPermissions', Permission[]> {
    const { defaultPermissions, loadDefaultPermissions } = useClientData()
    useEffect(() => {
        if (defaultPermissions === null) loadDefaultPermissions()
    }, [defaultPermissions, loadDefaultPermissions])
    return defaultPermissions ?? { status: 'loading' }
}

export function useStandardImages(): ClientDataResult<'standardImages', Record<StandardImage, Image>> {
    const { standardImages, loadStandardImages } = useClientData()
    useEffect(() => {
        if (standardImages === null) loadStandardImages()
    }, [standardImages, loadStandardImages])
    return standardImages ?? { status: 'loading' }
}

export function useGroups(): ClientDataResult<'groups', ExpandedGroup[]> {
    const { groups, loadGroups } = useClientData()
    useEffect(() => {
        if (groups === null) loadGroups()
    }, [groups, loadGroups])
    return groups ?? { status: 'loading' }
}

export function useSpecialCollections(): ClientDataResult<'specialCollections', ExpandedImageCollection[]> {
    const { specialCollections, loadSpecialCollections } = useClientData()
    useEffect(() => {
        if (specialCollections === null) loadSpecialCollections()
    }, [specialCollections, loadSpecialCollections])
    return specialCollections ?? { status: 'loading' }
}
