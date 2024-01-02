import { Image } from '@prisma/client';
import EndlessScroll, { createEndlessScrollContext } from './EndlessScroll';

export const ImageCollectionContext = createEndlessScrollContext<Image, 30>();
export default EndlessScroll;