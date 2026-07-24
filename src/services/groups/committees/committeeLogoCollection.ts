import '@pn-server-only'
import { committeeLogosImagePanelAuth } from './auth'
import { implementSpecialCollection } from '@/services/images/subservice/special/implement'

export const {
    internalOperations: committeeLogoImageOperations,
    specialCollectionPanelOperations: committeeLogosImagePanelOperations
} = implementSpecialCollection({
    special: 'COMMITTEELOGOS',
    imagePanelAuther: committeeLogosImagePanelAuth.dynamicFields({}),
    config: {
        name: 'Komitélogoer',
        description: 'Bilder brukt som komitélogoer. Hvert bilde i denne samlingen tilhører nøyaktig én komité.',
    }
})
