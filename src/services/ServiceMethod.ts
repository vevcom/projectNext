import { Smorekopp } from "./error";
import type { ServiceMethod, ServiceMethodConfig } from "./ServiceTypes";

export function ServiceMethod<
    TypeType,
    DetailedType,
    Params extends object,
    Return extends object | void,
    DynamicFields extends object | undefined,
    DynamicFieldsGetter extends DynamicFields
>(
    config: ServiceMethodConfig<true, TypeType, DetailedType, Params, Return, DynamicFields, DynamicFieldsGetter>
) : ServiceMethod<true, TypeType, DetailedType, Params, Return>

export function ServiceMethod<
    TypeType,
    DetailedType,
    Params extends object,
    Return extends object | void,
    DynamicFields extends object | undefined,
    DynamicFieldsGetter extends DynamicFields
>(config: ServiceMethodConfig<false, TypeType, DetailedType, Params, Return, DynamicFields, DynamicFieldsGetter>) : ServiceMethod<false, void, void, Params, Return>

export function ServiceMethod<
    TypeType,
    DetailedType,
    Params extends object,
    Return extends object | void,
    DynamicFields extends object | undefined,
    DynamicFieldsGetter extends DynamicFields
>(
    config: 
        | ServiceMethodConfig<true, TypeType, DetailedType, Params, Return, DynamicFields, DynamicFieldsGetter> 
        | ServiceMethodConfig<false, TypeType, DetailedType, Params, Return, DynamicFields, DynamicFieldsGetter>
) : ServiceMethod<true, TypeType, DetailedType, Params, Return> | ServiceMethod<false, void, void, Params, Return> {
    return config.withData ? {
        withData: true,
        transaction: (prisma) => ({
            execute: ({ data, params, session }, authRunConfig) => {
                if (authRunConfig.authConfig.withAut) {
                    const authRes = config.auther.auth({session, dynamicFields: config.dynamicFields({params, data})})
                    if (!authRes.authorized) throw new Smorekopp(authRes.status)
                }
                return config.serviceMethodHandler.transaction(prisma).execute({data, params, session})
            },
        }),
        typeValidate: config.serviceMethodHandler.typeValidate,
    } satisfies ServiceMethod<true, TypeType, DetailedType, Params, Return> : {
        withData: false,
        transaction: (prisma) => ({
            execute: ({ params, session }, authRunConfig) => {
                if (authRunConfig.authConfig.withAut) {
                    const authRes = config.auther.auth({session, dynamicFields: config.dynamicFields({ params })})
                    if (!authRes.authorized) throw new Smorekopp(authRes.status)
                }
                return config.serviceMethodHandler.transaction(prisma).execute({ params, session })
            },
        }),
    } satisfies ServiceMethod<false, void, void, Params, Return>
}