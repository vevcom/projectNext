'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readImagesPageAction } from '@/actions/images/read'
import type { ReadPageInput } from '@/lib/paging/Types'
import type { Image } from '@prisma/client'
import type { ImageCursor, ImageDetails } from '@/services/images/Types'

export type PageSizeImage = 30
const fetcher = async (x: ReadPageInput<PageSizeImage, ImageCursor, ImageDetails>) => {
    const ret = await readImagesPageAction.bind(null, { paging: x })()
    return ret
}

export const ImagePagingContext = generatePagingContext<Image, ImageCursor, PageSizeImage, ImageDetails>()
const ImagePagingProvider = generatePagingProvider({
    Context: ImagePagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default ImagePagingProvider
