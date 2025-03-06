import { z, ZodAny, ZodTypeAny } from "zod"

type Field<T extends { label: string }> = (args: T) => ZodTypeAny

export namespace zpn {
    /**
     * THis field is used to represent a checkbox in the frontend, but a boolean in the backend.
     * Note that it is assumed to be a SelectAsCheckbox in the frontend so one can distinguish
     * between 'off' and undefined.
     */
    export const checkboxOrBoolean: Field<{ 
        label: string 
    }> = ({ label }) => z.union([
        z.boolean(),
        z.literal('on'),
        z.literal('off')
    ]).transform(value => value === 'on' ? true : value === 'off' ? false : value)
}