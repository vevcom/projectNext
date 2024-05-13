import { UserFiltered } from "../users/Types";


export const omegaIdFields = [
    'id',
    'firstname',
    'lastname',
    'username',
] as const satisfies (keyof UserFiltered)[]