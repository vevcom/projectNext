import { RequirePermission } from "@/auth/auther/RequirePermission";

export const CreateJobAdAuther = RequirePermission.staticFields({ permission: 'JOBAD_CREATE' })
export const ReadJobAdAuther = RequirePermission.staticFields({ permission: 'JOBAD_READ' })
export const UpdateJobAdAuther = RequirePermission.staticFields({ permission: 'JOBAD_UPDATE' })
export const DestroyJobAdAuther = RequirePermission.staticFields({ permission: 'JOBAD_DESTROY' })