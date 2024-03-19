import { zfd } from "zod-form-data";
import { z, ZodRawShape } from 'zod';
import { ServerError } from "./error";


type SchemaType<T extends ZodRawShape> = z.infer<ReturnType<typeof z.object<T>>>
type Refiner<T extends ZodRawShape, Partialized extends boolean> = (data: Partialized extends true ? Partial<SchemaType<T>> : SchemaType<T>) => boolean
class ValidationBase<T extends ZodRawShape> {
    protected typeSchema : ReturnType<typeof z.object<T>>
    protected detailedSchema: ReturnType<typeof z.object<{[L in keyof T]: T[L]}>>

    constructor(obj: T | ReturnType<typeof z.object<T>>, details: {[L in keyof T]: T[L]} | ReturnType<typeof z.object<{[L in keyof T]: T[L]}>>) {
        if (obj instanceof z.ZodType) {
            this.typeSchema = obj
        } else {
            this.typeSchema = z.object(obj)
        }
        if (details instanceof z.ZodType) {
            this.detailedSchema = details
        } else {
            this.detailedSchema = z.object(details)
        }
    }
}

export class ValidationPartial<T extends ZodRawShape, K extends {[L in keyof T]: T[L]}> extends ValidationBase<T> {
    private refiner : {
        func: Refiner<T, true>,
        message: 'Dårlige parametere!'
    }
    constructor(typeSchema: T, detailedSchema: K) {
        super(typeSchema, detailedSchema)
        this.refiner = {
            func: () => true,
            message: 'Dårlige parametere!'
        }
    }
    detailedValidate(data: Partial<SchemaType<K>>) {
        return handleZodReturn(this.detailedSchema.partial().refine(this.refiner.func, this.refiner.message).safeParse(data))
    }
    typeValidate(data: FormData | Partial<SchemaType<T>>) {
        return zfd.formData(this.typeSchema).safeParse(data)
    }
    setRefiner(refiner_: Refiner<T, false>, message: string = 'Dårlige parametere!') {
        return new ValidationRefined<T, K, true>(this.typeSchema, this.detailedSchema, refiner_, message)
    }
}

export class Validation<T extends ZodRawShape, K extends {[L in keyof T]: T[L]}> extends ValidationBase<T> {
    constructor(obj: T, details: {[L in keyof T]: T[L]}) {
        super(obj, details)
    }
    pick<L extends(keyof T)[]>(keys: L): Validation<{ [P in L[number]]: T[P] }, { [P in L[number]]: K[P] }> {
        const typeSchema = pickKeys(this.typeSchema.shape, keys)
        const detailedSchema = pickKeys(this.detailedSchema.shape, keys)

        return new Validation(typeSchema, detailedSchema)
    }
    detailedValidate(data: SchemaType<K>) {
        return handleZodReturn(this.detailedSchema.safeParse(data))
    }
    typeValidate(data: FormData | SchemaType<T>) {
        return zfd.formData(this.typeSchema).safeParse(data)
    }
    partialize() {
        return new ValidationPartial(this.detailedSchema.shape, this.detailedSchema.shape)
    }
    setRefiner(refiner_: Refiner<T, false>, message: string = 'Dårlige parametere!') {
        return new ValidationRefined(this.typeSchema, this.detailedSchema, refiner_, message)
    }
}

export class ValidationRefined<T extends ZodRawShape, K extends {[L in keyof T]: T[L]}, const Partialized extends boolean = false> extends ValidationBase<T> {
    private refiner : {
        func: Refiner<T, false>,
        message: string,
    }
    constructor(obj: ReturnType<typeof z.object<T>>, details: ReturnType<typeof z.object<{[L in keyof T]: T[L]}>>, refiner: Refiner<T, false>, message: string) {
        super(obj, details)
        this.refiner = {
            func: refiner,
            message,
        }
    }
    detailedValidate(data: Partialized extends true ? Partial<SchemaType<K>> : SchemaType<K>) {
        return handleZodReturn(this.detailedSchema.refine(this.refiner.func, this.refiner.message).safeParse(data))
    }
    typeValidate(data: FormData | Partialized extends true ? Partial<SchemaType<T>> : SchemaType<T>) {
        return zfd.formData(this.typeSchema).safeParse(data)
    }
}

function handleZodReturn<T>(parse: {
    success: true,
    data: T,
} | {
    success: false,
    error: z.ZodError,
}) {
    if (!parse.success) {
        throw new ServerError('BAD PARAMETERS', parse.error.issues)
    }
    return parse.data
}

type HasDetailedValidate = {
    detailedValidate: (data: any) => any;
};
export type ValidationType<
    T extends HasDetailedValidate
> = Parameters<T["detailedValidate"]>['0'];

function pickKeys<T, L extends (keyof T)[]>(obj: T, keys: L) : { [P in L[number]]: T[P] } {
    return keys.reduce((result, key) => {
        result[key] = obj[key]
        return result
    }, {} as { [P in L[number]]: T[P] })
}
