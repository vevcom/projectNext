import styles from './Select.module.scss'
import { v4 as uuid } from 'uuid'
import type { SelectHTMLAttributes } from 'react'

export type PropTypes<ValueType> = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> & {
    name: string,
    label?: string,
    value?: ValueType,
    defaultValue?: ValueType,
    onChange?: (value: ValueType) => void,
    options: {
        value: ValueType,
        label?: string,
        key?: string,
    }[],
}

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
        const id = uuid()

        const optionElements = options.map(
            (option) => <option
                key={option.key ?? uuid()}
                value={option.value}
                selected={option.value === defaultValue}
            >
                {option.label ?? option.value}
            </option>
        )

        return (
            <div className={`${styles.Select} ${className}`}>
                <label htmlFor={id}>{label ?? name}</label>
                <select
                    {...props}
                    id={id}
                    name={name}
                    {
                        ...{ value }
                    }
                    onChange={(event) => {
                        if (onChange && options.length > 0) {
                            onChange(valueConverter(event.target.value))
                        }
                    }
                    }
                >
                    {optionElements}
                </select>
            </div>
        )
    }
}

export const SelectString = SelectConstructor((value: string) => value)
export const SelectNumber = SelectConstructor((value: string) => Number(value))
export const SelectNumberPossibleNULL = SelectConstructor((value: string) => (value === 'NULL' ? 'NULL' : Number(value)))
