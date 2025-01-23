import { RequirePermission } from '@/auth/auther/RequirePermission'

export const CreateLicenseAuther = RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' })
export const UpdateLicenseAuther = RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' })
export const DestroyLicenseAuther = RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' })
