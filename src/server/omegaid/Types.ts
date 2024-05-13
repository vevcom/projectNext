import { UserFiltered } from "../users/Types";
import { omegaIdFields } from "./ConfigVars";

export type OmegaId = Pick<UserFiltered, typeof omegaIdFields[number]>