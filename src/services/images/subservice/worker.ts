import '@pn-server-only'
import { imageOperations } from './operations'
import { imageProcessing } from './constants'
import { prisma } from '@/prisma-pn-client-instance'
import logger from '@/lib/logger'
import type { Prisma } from '@/prisma-generated-pn-types'

let stopping = false

/**
 * Claims one unprocessed image, atomically, so concurrent workers never pick the same row.
 * Images whose claim went stale (the process died mid-processing) become claimable again, and
 * images that exhausted their retries are left alone until an admin resets them.
 */
async function claimNextImage(): Promise<number | null> {
    const staleClaimCutoff = new Date(Date.now() - imageProcessing.staleClaimMinutes * 60 * 1000)
    const claimable = {
        processedFiles: { is: null },
        processingAttempts: { lt: imageProcessing.maxAttempts },
        OR: [
            { processingStartedAt: null },
            { processingStartedAt: { lt: staleClaimCutoff } },
        ],
    } satisfies Prisma.ImageWhereInput

    const candidate = await prisma.image.findFirst({
        where: claimable,
        orderBy: { createdAt: 'asc' },
        select: { id: true },
    })
    if (!candidate) return null

    // Taking the claim re-checks the same conditions, which is what makes it atomic: postgres
    // makes a concurrent update of this row wait, then re-evaluates the where against the
    // committed result, so a worker that lost the race updates nothing and gets count 0.
    const { count } = await prisma.image.updateMany({
        where: { id: candidate.id, ...claimable },
        data: { processingStartedAt: new Date() },
    })
    return count === 1 ? candidate.id : null
}

/**
 * @returns whether an image was claimed and processed - if so there may be more waiting, so the
 * loop should come straight back rather than sleeping.
 */
async function processNextImage(): Promise<boolean> {
    const imageId = await claimNextImage()
    if (imageId === null) return false

    // processImageVariants records its own failures on the image (attempts/error), so it only
    // throws on something unexpected - the caller logs it and the stale-claim clause eventually
    // makes the image claimable again.
    await imageOperations.processImageVariants.internalCall({ params: { imageId } })
    return true
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Polls for images whose resized variants have not been produced yet and processes them one at a
 * time. Runs until stopImageProcessingWorker is called. Errors (including the database being
 * unreachable, e.g. while the schema is being reset in dev) are logged and retried on the next
 * tick rather than killing the loop.
 */
export async function runImageProcessingWorker() {
    while (!stopping) {
        try {
            if (await processNextImage()) continue
        } catch (error) {
            logger.error(`Image processing worker tick failed: ${error}`)
        }
        await sleep(imageProcessing.pollIntervalMs)
    }
}

export function stopImageProcessingWorker() {
    stopping = true
}
