import '@pn-server-only'
import { beforeAll, beforeEach, describe, expect, test } from '@jest/globals'
import { prisma } from '@/prisma-pn-client-instance'
import { imageOperations } from '@/services/images/subservice/operations'
import { visibilityOperations } from '@/services/visibility/operations'
import { access } from 'fs/promises'
import { join } from 'path'
import { File } from 'node:buffer'

let collectionId: number

async function fileExists(fsLocation: string): Promise<boolean> {
    const filePath = join('store', 'images', fsLocation)
    try {
        await access(filePath)
        return true
    } catch {
        return false
    }
}

async function createTestCollection(): Promise<number> {
    // Create visibilities for the collection
    const visibilityAdmin = await visibilityOperations.create.internalCall({
        prisma
    })
    const visibilityRegular = await visibilityOperations.create.internalCall({
        prisma
    })

    // Create a collection
    const collection = await prisma.imageCollection.create({
        data: {
            name: `Image Subservice Test Collection ${Date.now()}`,
            description: 'Test collection',
            visibilityAdminId: visibilityAdmin.id,
            visibilityRegularId: visibilityRegular.id,
        },
    })
    return collection.id
}

beforeAll(async () => {
    // Collection will be created for each test
})

beforeEach(async () => {
    // Create fresh collection for each test
    collectionId = await createTestCollection()
    // Clean up any existing test images
    await prisma.image.deleteMany({ where: { collectionId } })
})

describe('destroyCollection', () => {
    test('deletes all image files in the store when collection is destroyed', async () => {
        // Create test image files by uploading them
        // Minimal valid PNG (1x1 red pixel)
        const pngBuffer = Buffer.from([
            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
            0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
            0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e,
            0x44, 0xae, 0x42, 0x60, 0x82
        ])
        const imageFile = new File([pngBuffer], 'test.png', { type: 'image/png' })

        const image1 = await imageOperations.uploadImage.internalCall({
            prisma,
            params: { collectionId },
            data: {
                imageFile,
                imageName: 'Test Image 1',
                imageAlt: 'Test alt text 1',
                imageLicenseId: undefined,
                imageCredit: undefined,
            },
            operationImplementationFields: { uploadAsStandardImage: null }
        })

        const image2 = await imageOperations.uploadImage.internalCall({
            prisma,
            params: { collectionId },
            data: {
                imageFile,
                imageName: 'Test Image 2',
                imageAlt: 'Test alt text 2',
                imageLicenseId: undefined,
                imageCredit: undefined,
            },
            operationImplementationFields: { uploadAsStandardImage: null }
        })

        // Verify files exist before destruction
        expect(await fileExists(image1.fsLocationOriginal)).toBe(true)
        expect(await fileExists(image1.fsLocationSmallSize)).toBe(true)
        expect(await fileExists(image1.fsLocationMediumSize)).toBe(true)
        expect(await fileExists(image1.fsLocationLargeSize)).toBe(true)

        expect(await fileExists(image2.fsLocationOriginal)).toBe(true)
        expect(await fileExists(image2.fsLocationSmallSize)).toBe(true)
        expect(await fileExists(image2.fsLocationMediumSize)).toBe(true)
        expect(await fileExists(image2.fsLocationLargeSize)).toBe(true)

        // Destroy collection (should also destroy files)
        await imageOperations.destroyCollection.internalCall({
            prisma,
            params: { collectionId },
        })

        // Verify collection is deleted
        expect(await prisma.imageCollection.findUnique({ where: { id: collectionId } })).toBeNull()

        // Verify all files are deleted
        expect(await fileExists(image1.fsLocationOriginal)).toBe(false)
        expect(await fileExists(image1.fsLocationSmallSize)).toBe(false)
        expect(await fileExists(image1.fsLocationMediumSize)).toBe(false)
        expect(await fileExists(image1.fsLocationLargeSize)).toBe(false)

        expect(await fileExists(image2.fsLocationOriginal)).toBe(false)
        expect(await fileExists(image2.fsLocationSmallSize)).toBe(false)
        expect(await fileExists(image2.fsLocationMediumSize)).toBe(false)
        expect(await fileExists(image2.fsLocationLargeSize)).toBe(false)
    })

    test('handles gracefully when some files are already missing', async () => {
        // Create test image files
        // Minimal valid PNG (1x1 red pixel)
        const pngBuffer = Buffer.from([
            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
            0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01, 0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53,
            0xde, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0x99, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
            0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e,
            0x44, 0xae, 0x42, 0x60, 0x82
        ])
        const imageFile = new File([pngBuffer], 'test.png', { type: 'image/png' })

        const image = await imageOperations.uploadImage.internalCall({
            prisma,
            params: { collectionId },
            data: {
                imageFile,
                imageName: 'Test Image',
                imageAlt: 'Test alt text',
                imageLicenseId: undefined,
                imageCredit: undefined,
            },
            operationImplementationFields: { uploadAsStandardImage: null }
        })

        // Manually delete one file to simulate missing file
        const { unlink } = await import('fs/promises')
        await unlink(join('store', 'images', image.fsLocationSmallSize))

        // Destroy collection should still succeed and not throw
        await expect(imageOperations.destroyCollection.internalCall({
            prisma,
            params: { collectionId },
        })).resolves.not.toThrow()

        // Verify collection is deleted
        expect(await prisma.imageCollection.findUnique({ where: { id: collectionId } })).toBeNull()

        // Verify remaining files are deleted
        expect(await fileExists(image.fsLocationOriginal)).toBe(false)
        expect(await fileExists(image.fsLocationMediumSize)).toBe(false)
        expect(await fileExists(image.fsLocationLargeSize)).toBe(false)
    })
})
