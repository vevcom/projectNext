'use client'
import styles from './Select.module.scss'
import { v4 as uuid } from 'uuid'
import { type SelectHTMLAttributes } from 'react'

export type PropTypes<ValueType> = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
    name: string,
    label?: string,
    onChange?: (value: ValueType) => void,
    options: {
        value: ValueType,
        label?: string,
        key?: string,
    }[],
} & ({
    value?: ValueType,
} | {
    defaultValue?: ValueType,
})

export function SelectConstructor<ValueType extends string | number>(valueConverter: (value: string) => ValueType) {
    return function Select({
        name,
        label,
        defaultValue,
        value,
        options,
        onChange,
        className,
        ...props
    }: PropTypes<ValueType>) {
        return (
            <div className={`${styles.Select} ${className}`}>
                <label htmlFor={name}>{label ?? name}</label>
                <select
                    {...props}
                    id={name}
                    name={name}
                    {
                        ...(value ? { value } : { defaultValue })
                    }
                    onChange={(event) => {
                        if (onChange && options.length > 0) {
                            onChange(valueConverter(event.target.value))
                        }
                    }
                    }
                >
                    {
                        options.map(option =>
                            <option
                                key={option.key ?? uuid()}
                                value={option.value}
                            >
                                {option.label ?? option.value}
                            </option>
                        )
                    }
                </select>
            </div>
        )
    }
}

export const SelectString = SelectConstructor((value: string) => value)
export const SelectNumber = SelectConstructor((value: string) => Number(value))
export const SelectNumberPossibleNULL = SelectConstructor<number | 'NULL'>(
    (value: string) => (value === 'NULL' ? 'NULL' : Number(value))
)
