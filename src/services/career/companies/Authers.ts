import { RequirePermission } from "@/auth/auther/RequirePermission";

export const ReadCompanyAuther = RequirePermission.staticFields({ permission: 'COMPANY_READ' })
export const CreateCompanyAuther = RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' })
export const UpdateCompanyAuther = RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' })
export const DestroyCompanyAuther = RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' })