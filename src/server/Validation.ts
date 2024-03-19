import { zfd } from "zod-form-data";
import { z, ZodRawShape } from 'zod';

export type schemaType<T extends ZodRawShape> = z.infer<ReturnType<typeof z.object<T>>>
export class Validation<T extends ZodRawShape, K extends T> {
    private typeSchema : ReturnType<typeof z.object<T>>
    private detailedSchema: ReturnType<typeof z.object<K>>

    constructor(obj: T, details: K) {
        this.typeSchema = z.object(obj)
        this.detailedSchema = z.object(details)
    }
    typeValidate(data: FormData | schemaType<T>) {
        return zfd.formData(this.typeSchema).safeParse(data)
    }
    detailedValidate(data: schemaType<K>) {
        return this.detailedSchema.safeParse(data)
    }
    pick<L extends (keyof T)[]>(keys: L): Validation<{ [P in L[number]]: T[P] }, { [P in L[number]]: K[P] }> {
        const typeSchema = pickKeys(this.typeSchema.shape, keys);
        const detailedSchema = pickKeys(this.detailedSchema.shape, keys);
    
        return new Validation(typeSchema, detailedSchema);
    }
}

function pickKeys<T, L extends (keyof T)[]>(obj: T, keys: L) : { [P in L[number]]: T[P] } {
    return keys.reduce((result, key) => {
        result[key] = obj[key];
        return result;
    }, {} as { [P in L[number]]: T[P] });
}