import type { imageSchemas } from '@/services/images/subservice/schemas'
import type { ActionFromSubServiceOperation } from '@/services/actionTypes'
import type { SubServiceOperation } from '@/services/serviceOperation'

/**
 * The action type for uploading/updating an image.
 */
export type UploadSpecialCollectionImageAction = ActionFromSubServiceOperation<
    SubServiceOperation<unknown, false, undefined, typeof imageSchemas.uploadImage>
>
