import { ReadUserAuther } from "@/actions/users/Authers"
import { apiHandler, apiHandlerNoData } from "@/api/apiHandler"
import { ReadUserProfile } from "@/services/users/read"
import { UpdateUser } from "@/services/users/update"
import { UpdateUserAuther } from "@/actions/users/Authers"

export const GET = apiHandlerNoData({
    serviceMethod: ReadUserProfile,
    auther: ReadUserAuther,
    dynamicFields: ({ params }) => ({ username: params.username }),
    params: (rawparams: {username: string}) => ({ username: rawparams.username })
})

export const PATCH = apiHandler({
    serviceMethod: UpdateUser,
    auther: UpdateUserAuther,
    dynamicFields: () => undefined,
    params: (rawparams: { username: string }) => ({ username: rawparams.username })
})