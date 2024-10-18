import { RequirePermission } from "@/auth/auther/RequirePermission";

export const ReadInterestGroupAuther = RequirePermission.staticFields({ permission: 'INTEREST_GROUP_READ' })

export const CreateInterestGroupAuther = RequirePermission.staticFields({ permission: 'INTEREST_GROUP_ADMIN' })