import { PrismaClient } from "@prisma/client";
import { SafeValidationReturn, Validation, ValidationTypes } from "./Validation";
import { z } from "zod";

type Data<
    TypeValidation extends z.ZodRawShape,
    DetailedValidation extends z.ZodRawShape,
> = ValidationTypes<Validation<TypeValidation, DetailedValidation>>

export abstract class ServiceMethod<
    TypeValidation extends z.ZodRawShape,
    DetailedValidation extends z.ZodRawShape,
    Params extends object,
    Return extends object | void = void,
> {
    private prisma: PrismaClient
    protected abstract get validation() : Validation<TypeValidation, DetailedValidation>

    constructor(
        prisma: PrismaClient, 
    ) {
        this.prisma = prisma
    }

    /**
     * This function should  be run before the execute function if you are unsure of the shape of the data is.
     * The function is 'safe', i.e it does not throw errors, but returns a SafeValidationReturn with a success boolean.
     * @param data - data of unknown shape
     * @returns SafeValidationReturn - a return object with a success boolean and the data or error
     */
    public typeValidate(data: unknown | Data<TypeValidation, DetailedValidation>['Type']): SafeValidationReturn<DetailedValidation> {
        return this.validation.typeValidate(data)
    }

    protected abstract handler(params: Params, handler: Data<TypeValidation, DetailedValidation>['Detailed']): Promise<Return>

    /**
     * This function should will validated the data and then run the main handler function.
     * WARNING: This function will throw an error if the data is not valid or if soething goes wrong in the service logic.
     * @param params - parameters for the service function
     * @param rawdata
     * @returns some generic object or void
    */
    public async execute(params: Params, rawdata: Data<TypeValidation, DetailedValidation>['Detailed']): Promise<Return> {
        const data = this.validation.detailedValidate(rawdata)
        return this.handler(params, data)
    }

    public static new<
        TypeValidation extends z.ZodRawShape,
        DetailedValidation extends z.ZodRawShape,
        Params extends object,
        Return extends object | void = void,
    >({
        validation,
        handler,
    }: {
        validation: Validation<TypeValidation, DetailedValidation>,
        handler: (prisma: PrismaClient, params: Params, handler: Data<TypeValidation, DetailedValidation>['Detailed']) => Promise<Return>
    }): typeof ServiceMethod<TypeValidation, DetailedValidation, Params, Return> {
        class NewServiceMethod extends ServiceMethod<TypeValidation, DetailedValidation, Params, Return> {
            protected get validation() {
                return validation
            }
            protected handler = handler.bind(this, this.prisma)
        }
        return NewServiceMethod
    }
}