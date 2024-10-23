'use client'
import styles from './DateInput.module.scss'
import { toLocalDate } from '@/dates/toLocal'
import { displayDefaultInputValue } from '@/dates/displayDefaultInputValue'
import { useState } from 'react'
import type { PropTypes as PropTypesInput } from './TextInput'
import type { ChangeEvent } from 'react'

type PropTypes = Omit<PropTypesInput, 'type' | 'defaultValue'> & {
    defaultValue?: PropTypesInput['defaultValue'] | Date,
    includeTime?: boolean,
}

export default function DateInput({
    label = 'default',
    color = 'black',
    className,
    defaultValue,
    includeTime = false,
    ...props
}: Omit<PropTypes, 'type'>) {
    const defaultValueTransformedLocal = defaultValue instanceof Date
        ? displayDefaultInputValue(toLocalDate(defaultValue), includeTime)
        : defaultValue
    const defaultValueTransformedUtc = defaultValue instanceof Date
        ? defaultValue.toISOString().substring(0, includeTime ? 16 : 10)
        : defaultValue
    const [utcValue, setUtcValue] = useState(defaultValueTransformedUtc)

    const setUtc = (e: ChangeEvent<HTMLInputElement>) => {
        setUtcValue(toLocalDate(new Date(e.target.value)).toISOString().substring(0, includeTime ? 16 : 10))
    }

    return (
        <div className={`${styles.DateInput} ${styles[color]} ${className}`}>
            <label className={styles.label}>{label}</label>
            <input
                onChange={setUtc}
                defaultValue={defaultValueTransformedLocal}
                type={includeTime ? 'datetime-local' : 'date'}
                {...props}
                name={`${props.name}Local`}
            />
            <input
                defaultValue={defaultValueTransformedUtc}
                {...props}
                type="hidden"
                name={props.name}
                value={utcValue}
            />
        </div>
    )
}
