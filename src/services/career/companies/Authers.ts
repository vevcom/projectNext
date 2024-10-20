import { RequirePermission } from "@/auth/auther/RequirePermission";

export const CreateCompanyAuther = RequirePermission.staticFields({ permission: 'COMPANY_ADMIN' })