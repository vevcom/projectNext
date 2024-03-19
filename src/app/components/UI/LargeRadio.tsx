"use client"

import styles from './LargeRadio.module.scss'
import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

type Listitem = {
    id: number | string,
    name: string,
}

export default function LargeRadio<Type extends Listitem>({
    list: initalList,
    onSelect,
    name,
}: {
    list: Type[],
    onSelect?: (item: Type | undefined) => void,
    name?: string,
}) {

    const [list, setList] = useState<Type[]>(initalList)
    const [selectedItem, setSelectedItem] = useState<Type | undefined>(list.length > 0 ? list[0] : undefined)

    function onItemSelectChange(e: React.ChangeEvent<HTMLInputElement>) {
        const id = Number(e.target.value)

        const newSelect = list.find(item => item.id === id)
        setSelectedItem(newSelect)
        if (onSelect) onSelect(newSelect)
    }

    /*useEffect(() => {
        setList(initalList)
        console.log("hei")

        if (!initalList.some(item => item.id === selectedItem?.id)) {
            setSelectedItem(undefined)
        }
    }, [initalList])*/

    return (
        <ul className={styles.container}>
            {list.map((item, i) =>
                <li key={uuid()}>
                    <input
                        type="radio"
                        value={item.id}
                        id={`item_${item.id}`}
                        name={name ?? ""}
                        checked={item.id === selectedItem?.id}
                        onChange={onItemSelectChange}
                    />
                    <label htmlFor={`item_${item.id}`}>{item.name}</label>
                </li>
            )}
        </ul>
    )
}
