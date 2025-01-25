import { RequirePermission } from '@/auth/auther/RequirePermission'

export const readCompanyAuther = RequirePermission.staticFields({ permission: 'COMPANY_READ' })
export const createCompanyAuther = RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' })
export const updateCompanyAuther = RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' })
export const destroyCompanyAuther = RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' })
