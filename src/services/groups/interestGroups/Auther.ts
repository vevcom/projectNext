import { RequirePermission } from '@/auth/auther/RequirePermission'
import { RequirePermissionOrGroupAdmin } from '@/auth/auther/RequirePermissionOrGroupAdmin'

export const readInterestGroupAuther = RequirePermission.staticFields({ permission: 'INTEREST_GROUP_READ' })

export const createInterestGroupAuther = RequirePermission.staticFields({ permission: 'INTEREST_GROUP_ADMIN' })

export const updateInterestGroupAuther = RequirePermissionOrGroupAdmin.staticFields({ permission: 'INTEREST_GROUP_ADMIN' })

export const destroyInterestGroupAuther = RequirePermission.staticFields({ permission: 'INTEREST_GROUP_ADMIN' })
