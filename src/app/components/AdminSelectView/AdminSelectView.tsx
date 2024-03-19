"use client"
import styles from './AdminSelectView.module.scss'
import { useState, useEffect } from 'react'
import { v4 as uuid } from 'uuid'
import { child } from 'winston'

type Listitem = {
    id: number | string,
    name: string,
}

export default function AdminSelectView<Type extends Listitem>({
    list: initalList,
    children,
}: {
    list: Type[],
    children: React.ReactElement,
}) {

    const [list, setList] = useState<Type[]>(initalList)
    const [selectedItem, setSelectedItem] = useState<Type | undefined>()

    function onItemSelectChange(e: React.ChangeEvent<HTMLInputElement>) {
        const id = Number(e.target.value)

        setSelectedItem(list.find(item => item.id === id))
    }

    useEffect(() => {
        setList(initalList)

        if (!initalList.some(item => item.id === selectedItem?.id)) {
            setSelectedItem(undefined)
        }
    }, [initalList])

    return (
        <div className={styles.container}>
            <ul>
                {list.map((item, i) =>
                    <li key={uuid()}>
                        <input
                            type="radio"
                            value={item.id}
                            id={`item_${item.id}`}
                            name="adminSelect"
                            checked={item.id === selectedItem?.id}
                            onChange={onItemSelectChange}
                        />
                        <label htmlFor={`item_${item.id}`}>{item.name}</label>
                    </li>
                )}
            </ul>

            <div>
                {selectedItem && children ? children : null}
            </div>


        </div>
    )
}
