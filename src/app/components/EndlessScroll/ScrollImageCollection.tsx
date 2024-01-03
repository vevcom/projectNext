'use client'

import { Image } from '@prisma/client'
import read from '@/actions/images/collections/read'
import EndlessScroll, { createEndlessScrollContext } from './EndlessScroll'
import { ReadPageInput } from '@/actions/type'

export type PageSizeImageCollection = 30
const fetcher = async (x: ReadPageInput<PageSizeImageCollection, {id: number}>) => {
    const ret = await read(x)
    return {
        ...ret,
        data: ret.data?.images
    }
}

export const ImageCollectionContext = createEndlessScrollContext<Image, PageSizeImageCollection, {id: number}>();
const ScrollImageProvider = EndlessScroll({Context: ImageCollectionContext, fetcher})
export default ScrollImageProvider