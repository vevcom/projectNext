import '@pn-server-only'
import { profileImagesImagePanelAuth } from './auth'
import { implementSpecialCollection } from '@/services/images/subservice/special/implement'

export const {
    internalOperations: userProfileImageOperations,
    specialCollectionPanelOperations: profileImagesImagePanelOperations,
    generateCollectionFromConfig: generateProfileImagesCollectionFromConfig
} = implementSpecialCollection({
    special: 'PROFILEIMAGES',
    imagePanelAuther: profileImagesImagePanelAuth.dynamicFields({}),
    config: {
        name: 'Profilbilder',
        description: 'Bilder brukt som profilbilder. Hvert bilde i denne samlingen tilhører nøyaktig én bruker.',
    }
})
