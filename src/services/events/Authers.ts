import { RequirePermission } from "@/auth/auther/RequirePermission";

export const CreateEventAuther = RequirePermission.staticFields({ permission: 'EVENT_CREATE' })