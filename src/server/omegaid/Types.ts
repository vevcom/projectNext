import { UserFiltered } from "@/server/users/Types";
import { omegaIdFields } from "./ConfigVars";

export type OmegaId = Pick<UserFiltered, typeof omegaIdFields[number]>

export type OmegaIdJWT = {
    sub: UserFiltered['id'],
    usrnm: UserFiltered['username'],
    gn: UserFiltered['firstname'],
    sn: UserFiltered['lastname'],
    pm: boolean,
}