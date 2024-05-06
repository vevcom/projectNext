'use client'

import styles from './LargeRadio.module.scss'
import { useState } from 'react'
import { v4 as uuid } from 'uuid'

type Listitem = {
    id: number | string,
    name: string,
}

export default function LargeRadio<Type extends Listitem>({
    list: initalList,
    onSelect,
    defaultSelection,
    name,
    className,
}: {
    list: Type[],
    onSelect?: (item: Type | undefined) => void,
    defaultSelection?: Type,
    name?: string,
    className?: string,
}) {
    const [list, setList] = useState<Type[]>(initalList)
    const [selectedItem, setSelectedItem] = useState<Type | undefined>(defaultSelection)

    function onItemSelectChange(e: React.ChangeEvent<HTMLInputElement>) {
        const id = Number(e.target.value)

        const newSelect = list.find(item => item.id === id)
        setSelectedItem(newSelect)
        if (onSelect) onSelect(newSelect)
    }

    return (
        <ul className={`${styles.container} ${className ?? ''}`}>
            {list.map((item, i) =>
                <li key={uuid()}>
                    <input
                        type="radio"
                        value={item.id}
                        id={`item_${item.id}`}
                        name={name ?? ''}
                        checked={item.id === selectedItem?.id}
                        onChange={onItemSelectChange}
                    />
                    <label htmlFor={`item_${item.id}`}>{item.name}</label>
                </li>
            )}
        </ul>
    )
}
