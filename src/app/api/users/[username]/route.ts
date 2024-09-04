import { ReadUserAuther } from "@/actions/users/Authers"
import { apiHandler } from "@/api/apiHandler"
import { User } from "@/services/users"
import { UpdateUserAuther } from "@/actions/users/Authers"

export const GET = apiHandler({
    serviceMethod: User.readProfile,
    params: (rawparams: {username: string}) => ({ username: rawparams.username })
})

export const PATCH = apiHandler({
    serviceMethod: User.update,
    params: (rawparams: { username: string }) => ({ username: rawparams.username })
})