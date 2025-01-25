import { RequirePermission } from '@/auth/auther/RequirePermission'

export const createJobAdAuther = RequirePermission.staticFields({ permission: 'JOBAD_CREATE' })
export const readJobAdAuther = RequirePermission.staticFields({ permission: 'JOBAD_READ' })
export const updateJobAdAuther = RequirePermission.staticFields({ permission: 'JOBAD_UPDATE' })
export const destroyJobAdAuther = RequirePermission.staticFields({ permission: 'JOBAD_DESTROY' })
