import { RequireVisibility } from "@/auth/auther/RequireVisibility";

export const CreateEventRegistrationAuther = RequireVisibility.staticFields({ bypassPermission: 'GROUP_ADMIN' })