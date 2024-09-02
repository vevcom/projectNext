import { z } from 'zod'
import { ValidationTypes, Validation } from './Validation'
import { prismaTransactionWithErrorConvertion, type PrismaTransaction } from './prismaCall'

type Data<
    TypeValidation extends z.ZodRawShape,
    DetailedValidation extends z.ZodRawShape,
> = ValidationTypes<Validation<TypeValidation, DetailedValidation>>

export function ServiceMethod<
    TypeValidation extends z.ZodRawShape,
    DetailedValidation extends z.ZodRawShape,
    Params extends object,
    Return extends object | void = void,
>({
    validation,
    handler,
}: {
    validation: Validation<TypeValidation, DetailedValidation>,
    handler: (prisma: PrismaTransaction, params: Params, data: Data<TypeValidation, DetailedValidation>['Detailed']) => Promise<Return>,
}) {
    return {
        transaction: (prisma: PrismaTransaction | 'NEW_TRANSACTION') => ({
            execute: (params: Params, rawdata: Data<TypeValidation, DetailedValidation>['Detailed']) => {
                const data = validation.detailedValidate(rawdata)
                if (prisma === 'NEW_TRANSACTION') {
                    return prismaTransactionWithErrorConvertion(
                        newprisma => handler(newprisma, params, data)
                    )
                }
                return handler(prisma, params, data)
            }
        }),
        typeValidate: (data: unknown | Data<TypeValidation, DetailedValidation>['Type']) => validation.typeValidate(data),
    }
}

export type ServiceMethod<
    TypeValidation extends z.ZodRawShape,
    DetailedValidation extends z.ZodRawShape,
    Params extends object,
    Return extends object | void = void,
> = ReturnType<typeof ServiceMethod<TypeValidation, DetailedValidation, Params, Return>>


