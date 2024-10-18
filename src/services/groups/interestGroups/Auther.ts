import { RequirePermission } from "@/auth/auther/RequirePermission";
import { RequirePermissionOrGroupAdmin } from "@/auth/auther/RequirePermissionOrGroupAdmin";

export const ReadInterestGroupAuther = RequirePermission.staticFields({ permission: 'INTEREST_GROUP_READ' })

export const CreateInterestGroupAuther = RequirePermission.staticFields({ permission: 'INTEREST_GROUP_ADMIN' })

export const UpdateInterestGroupAuther = RequirePermissionOrGroupAdmin.staticFields({ permission: 'INTEREST_GROUP_ADMIN' })

export const DestroyInterestGroupAuther = RequirePermissionOrGroupAdmin.staticFields({ permission: 'INTEREST_GROUP_ADMIN' })