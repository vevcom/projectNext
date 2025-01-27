import { RequirePermission } from '@/auth/auther/RequirePermission'

export const createLicenseAuther = RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' })
export const readAllLicensesAuther = RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' })
export const updateLicenseAuther = RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' })
export const destroyLicenseAuther = RequirePermission.staticFields({ permission: 'LICENSE_ADMIN' })
