import '@pn-server-only'
import { specialImageCollectionsAdminAuth } from '@/services/images/specialPanels/auth'
import { visibilityIncluder, toMatrix } from '@/services/visibility/implement'
import { checkVisibility } from '@/auth/visibility/checkVisibility'
import { ServerError } from '@/services/error'
import type { PrismaPossibleTransaction } from '@/services/serviceOperation'
import type { SessionMaybeUser } from '@/auth/session/Session'

/**
 * Checks whether the session administrates the collection an image belongs to.
 *
 * The two kinds of collection answer this question differently:
 * - a dynamic collection is administrated by the sessions fulfilling its admin visibility level
 *   (or by anyone holding IMAGE_ADMIN, the same bypass the dynamic image auth uses)
 * - a special collection has no meaningful visibility levels - it is administrated by the sessions
 *   passing the panel auth of the service owning it
 *
 * @param imageId - the image whose collection is checked
 * @returns whether the session administrates the collection containing the image
 */
export async function sessionAdministratesCollectionOfImage({
    prisma,
    session,
    imageId,
}: {
    prisma: PrismaPossibleTransaction<false>,
    session: SessionMaybeUser,
    imageId: number,
}): Promise<boolean> {
    const image = await prisma.image.findUnique({
        where: {
            id: imageId,
        },
        select: {
            collection: {
                select: {
                    special: true,
                    visibilityAdmin: {
                        include: visibilityIncluder,
                    },
                },
            },
        },
    })
    if (!image) throw new ServerError('NOT FOUND', `Image with id ${imageId} does not exist`)

    const { special, visibilityAdmin } = image.collection

    if (special) {
        return specialImageCollectionsAdminAuth[special].dynamicFields({}).auth(session).authorized
    }

    return checkVisibility(session.memberships, toMatrix(visibilityAdmin))
        || session.permissions.includes('IMAGE_ADMIN')
}
