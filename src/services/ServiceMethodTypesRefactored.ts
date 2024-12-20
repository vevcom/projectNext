import { AutherStaticFieldsBound } from "@/auth/auther/Auther"
import { SessionMaybeUser } from "@/auth/Session"
import { Prisma, PrismaClient } from "@prisma/client"
import { TypeValidateReturn } from "./ServiceTypes"

export type PrismaPossibleTransaction<
    OpensTransaction extends boolean
> = OpensTransaction extends true ? PrismaClient : Prisma.TransactionClient

/**
 * Type for an object that contains params and data fields as long as thery are not undefined.
 * For example, if Params is undefined and Data is not, the type will be { data: Data }.
 * Conversely, if Data is undefined and Params is not, the type will be { params: Params }.
 * If both are undefined, the type will be {}.
 * This is used to make the type of the arguments of a service method more readable.
 */
export type ServiceMethodParamsData<Params, Data> = (
    Params extends undefined ? {} : { params: Params }
) & (
    Data extends undefined ? {} : { data: Data }
)

export type ServiceMethodArguments<OpensTransaction extends boolean, Params, Data> = {
    prisma: PrismaPossibleTransaction<OpensTransaction>,
    session: SessionMaybeUser,
} & ServiceMethodParamsData<Params, Data>

/**
 * This is the type for the argument that are passed to the execute method of a service method.
 */
export type ServiceMethodExecuteArgs<Params, Data> = {
    session: SessionMaybeUser,
    bypassAuth?: boolean,
} & ServiceMethodParamsData<Params, Data>

/**
 * This is the type for the configuration of a service method. I.e. what is passed to the ServiceMethod function when creating a service method..
 */
export type ServiceMethodConfig<Params, GeneralData, DetailedData, OpensTransaction extends boolean, Return, DynamicFields extends object> = {
    auther: AutherStaticFieldsBound<DynamicFields, 'USER_NOT_REQUIERED_FOR_AUTHORIZED' | 'USER_REQUIERED_FOR_AUTHORIZED'>,
    dynamicAuthFields: () => DynamicFields | Promise<DynamicFields>,
    opensTransaction?: OpensTransaction,
    validation?: {
        detailedValidate: (data: DetailedData | unknown) => DetailedData,
        typeValidate: (data: unknown | FormData | GeneralData) => TypeValidateReturn<DetailedData>,
    },
    method: (args: ServiceMethodArguments<OpensTransaction, Params, DetailedData>) => Return,
}
