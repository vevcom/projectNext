import { z } from "zod";
import { zfd } from "zod-form-data";
import { ServerError } from "./error";

/**
 * Type for the objects that is used to make sure the  two detailed and type schemas have the same keys
 */
type SameKeys<T, U> = {
    [K in keyof T | keyof U]: K extends keyof T & keyof U ? (T[K] | U[K]) : never;
}

type Tranformer<
    Type extends z.ZodRawShape, 
    Detailed extends z.ZodRawShape,
    Partialized extends boolean = false
> = (data: PureTsTypeOfSchema<Type, Partialized>) => PureTsTypeOfSchema<Detailed, Partialized>

type Refiner<
    Detailed extends z.ZodRawShape,
    Partialized extends boolean = false
> = (data: PureTsTypeOfSchema<Detailed, Partialized>) => boolean

type PureTsTypeOfSchema<
    T extends z.ZodRawShape, 
    Partialized extends boolean = false
> = Partialized extends true ? Partial<z.infer<ReturnType<typeof z.object<T>>>> : z.infer<ReturnType<typeof z.object<T>>>

export class ValidationBase<
    Type extends SameKeys<Type, Detailed> & z.ZodRawShape,
    Detailed extends SameKeys<Detailed, Type> & z.ZodRawShape,
> {
    private typeSchema: z.ZodObject<Type>;
    private detailedSchema: z.ZodObject<Detailed>;

    constructor({
        type,
        details
    }: {
        type: Type,
        details: Detailed
    }) {
        this.typeSchema = z.object(type);
        this.detailedSchema = z.object(details);
    }

    createValidation<T extends keyof Type & keyof Detailed>({
        keys,
        transformer,
        refiner,
    }:{
        keys: T[], 
        transformer: Tranformer<{ [P in T]: Type[P] }, { [P in T]: Detailed[P] }>
        refiner?: Refiner<{ [P in T]: Detailed[P] }>
    }){
        const typeSchema = pickKeys(this.typeSchema.shape, keys)
        const detailedSchema = pickKeys(this.detailedSchema.shape, keys)
        return new Validation<{ [P in T]: Type[P] }, { [P in T]: Detailed[P] }>({
            type: typeSchema,
            details: detailedSchema,
            transformer: transformer as Tranformer<{ [P in T]: Type[P] }, { [P in T]: Detailed[P] }>,
            refiner: refiner as Refiner<{ [P in T]: Detailed[P] }>,
        })
    }

    createValidationPartial<T extends keyof Type & keyof Detailed>({
        keys,
        transformer,
        refiner,
    }:{
        keys: T[], 
        transformer: Tranformer<{ [P in T]: Type[P] }, { [P in T]: Detailed[P] }, true>
        refiner?: Refiner<{ [P in T]: Detailed[P] }, true>
    }){
        const typeSchema = pickKeys(this.typeSchema.shape, keys)
        const detailedSchema = pickKeys(this.detailedSchema.shape, keys)
        return new ValidationPartial<{ [P in T]: Type[P] }, { [P in T]: Detailed[P] }>({
            type: typeSchema,
            details: detailedSchema,
            transformer: transformer as Tranformer<{ [P in T]: Type[P] }, { [P in T]: Detailed[P] }, true>,
            refiner: refiner as Refiner<{ [P in T]: Detailed[P] }, true>,
        })
    }
}

class Validation<
    Type extends z.ZodRawShape,
    Detailed extends z.ZodRawShape,
> {
    protected transformer: Tranformer<Type, Detailed>;
    protected typeSchema: z.ZodObject<Type>;
    protected detailedSchema: z.ZodObject<Detailed>;
    protected refiner?: Refiner<Detailed>;

    constructor({
        type,
        details,
        transformer,
        refiner,
    }: {
        type: Type,
        details: Detailed,
        transformer: Tranformer<Type, Detailed>
        refiner?: Refiner<Detailed>,
    }) {
        this.typeSchema = z.object(type);
        this.detailedSchema = z.object(details);
        this.transformer = transformer;
        this.refiner = refiner;
    }
    
    typeValidate(data: FormData | PureTsTypeOfSchema<Type>) {
        const parse = zfd.formData(this.typeSchema).safeParse(data);
        if (!parse.success) return parse;
        return {
            success: true,
            data: this.transformer(parse.data)
        }
    }

    detailedValidate(data: PureTsTypeOfSchema<Detailed>) {
        const parse = this.detailedSchema.refine(this.refiner ? this.refiner : data => true).safeParse(data);
        if (!parse.success) throw new ServerError('BAD PARAMETERS', parse.error.issues)
        return parse.data;
    }
}

class ValidationPartial<
    Type extends z.ZodRawShape,
    Detailed extends z.ZodRawShape,
>  {
    protected transformer: Tranformer<Type, Detailed, true>;
    protected typeSchema: z.ZodObject<Type>;
    protected detailedSchema: z.ZodObject<Detailed>;
    protected refiner?: Refiner<Detailed, true>;

    constructor({
        type,
        details,
        transformer,
        refiner,
    }: {
        type: Type,
        details: Detailed,
        transformer: Tranformer<Type, Detailed, true>
        refiner?: Refiner<Detailed, true>
    }) {
        this.typeSchema = z.object(type);
        this.detailedSchema = z.object(details);
        this.transformer = transformer;
        this.refiner = refiner;
    }
    
    typeValidate(data: FormData | Partial<PureTsTypeOfSchema<Type, true>>) {
        const parse = zfd.formData(this.typeSchema).safeParse(data);
        if (!parse.success) return parse;
        return {
            success: true,
            data: this.transformer(parse.data)
        }
    }

    detailedValidate(data: PureTsTypeOfSchema<Detailed, true>) {
        const parse = this.detailedSchema.refine(this.refiner ? this.refiner : data => true).safeParse(data);
        if (!parse.success) throw new ServerError('BAD PARAMETERS', parse.error.issues)
        return parse.data;
    }
}

function pickKeys<T, L extends(keyof T)[]>(obj: T, keys: L): { [P in L[number]]: T[P] } {
    return keys.reduce((result, key) => {
        result[key] = obj[key]
        return result
    }, {} as { [P in L[number]]: T[P] })
}

export type ValidationTypes<V> = V extends Validation<infer Type, infer Detailed>
    ? { Type: PureTsTypeOfSchema<Type>, Detailed: PureTsTypeOfSchema<Detailed> }
    : V extends ValidationPartial<infer Type, infer Detailed> ? { Type: PureTsTypeOfSchema<Type, true>, Detailed: PureTsTypeOfSchema<Detailed, true> } : never;


