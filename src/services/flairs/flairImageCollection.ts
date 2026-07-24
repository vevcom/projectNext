import '@pn-server-only'
import { flairImagesImagePanelAuth } from './auth'
import { implementSpecialCollection } from '@/services/images/subservice/special/implement'

export const {
    internalOperations: flairImageOperations,
    specialCollectionPanelOperations: flairImagesImagePanelOperations
} = implementSpecialCollection({
    special: 'FLAIRIMAGES',
    imagePanelAuther: flairImagesImagePanelAuth.dynamicFields({}),
    config: {
        name: 'Flairbilder',
        description: 'Bilder brukt av flairs. Hvert bilde i denne samlingen tilhører nøyaktig én flair.',
    }
})
