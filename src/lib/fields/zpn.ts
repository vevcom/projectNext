import { z } from 'zod'
import type { EnumLike } from 'zod'
import { FIELD_IS_PRESENT_VALUE } from '@/app/_components/UI/CheckboxFieldPresent'
import { zfd } from 'zod-form-data'

export namespace zpn {
    /**
     * This field is used to represent a boolean that could be a checkbox in frontend with no specified value
     * That is: the value is 'on' or not present at all (default behavior of checkboxes)
     */
    export const checkboxOrBoolean = ({ }: { label: string }) => z.union([
        z.boolean(), // mosltly for the backend
        zfd.repeatable(z.literal('on').or(z.literal(FIELD_IS_PRESENT_VALUE)).array()) // mostly for the frontend (forms)
    ]).transform(value => {
        if (typeof value === 'boolean') return value
        if (value.includes('on')) return true
        return false
    })

    /**
     * This field is used to represent a list of enums that could be checkboxes in frontend with values as the enum values
     * In the array it is also allowd to have the value FIELD_IS_PRESENT_VALUE so that the server can detect that the field is present
     * @returns 
     */
    export const enumListCheckboxFriendly = <T extends EnumLike>({ enum: enumValues }: {
        label: string,
        enum: T
    }) => z.union([
        z.nativeEnum(enumValues).array(), // mosltly for the backend
        zfd.repeatable( // mostly for the frontend (forms)
            (z.nativeEnum(enumValues).or(z.literal(FIELD_IS_PRESENT_VALUE))).array(),
        )
    ]).transform(values => {
        const filtered: T[keyof T][] = []
        for (const value of values) {
            if (value === FIELD_IS_PRESENT_VALUE) continue
            filtered.push(value)
        }
        return filtered
    })

    /**
     * This field is used to represent a list of numbers that could be checkboxes in frontend with values as the numbers
     * In the array it is also allowd to have the value FIELD_IS_PRESENT_VALUE so that the server can detect that the field is present
     */
    export const numberListCheckboxFriendly = ({}: { label: string }) => z.union([
        z.number().array(), // mosltly for the backend
        zfd.repeatable(z.coerce.number().or(z.literal(FIELD_IS_PRESENT_VALUE)).array()) // mostly for the frontend (forms)
    ]).transform(values => {
        const filtered: number[] = []
        for (const value of values) {
            if (value === FIELD_IS_PRESENT_VALUE) continue
            filtered.push(value)
        }
        return filtered
    })

    export const date = ({ label }: { label: string }) => z.string().transform((val) => new Date(val)).refine((date) => !isNaN(date.getTime()), {
        message: `${label} er i innvalid`,
    })
}
