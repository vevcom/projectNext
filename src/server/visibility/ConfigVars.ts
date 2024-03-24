import { Permission } from "@prisma/client";

/**
 * These are the permissions that buypass the visibiity system. i.e. for reading images
 * if the user has the permission it does not matter if the visibility is fullfilled. 
 */
export const BuypassPermissions = {
    images: 'IMAGE_ADMIN',
    cms: 'CMS_ADMIN',
    events: 'EVENT_ADMIN'
} as const satisfies { [key: string]: Permission }

type BuyPassPermissions = typeof BuypassPermissions[keyof typeof BuypassPermissions]