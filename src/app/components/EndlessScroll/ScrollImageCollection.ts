import { Image } from '@prisma/client'
import read from '@/actions/images/collections/read'
import EndlessScroll, { createEndlessScrollContext } from './EndlessScroll'
import { ReadPageInput } from '@/actions/type'

export type pageSizeImageCollection = 30
const fetcher = async (x: ReadPageInput<pageSizeImageCollection, {id: number}>) => {
    const ret = await read(x)
    return {
        ...ret,
        data: ret.data?.images
    }
}

export const ImageCollectionContext = createEndlessScrollContext<Image, pageSizeImageCollection, {id: number}>()
export default EndlessScroll({Context: ImageCollectionContext, fetcher})