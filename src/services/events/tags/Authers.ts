import { RequirePermission } from "@/auth/auther/RequirePermission";

export const CreateEventTagAuther = RequirePermission.staticFields({ permission: 'EVENT_ADMIN' })