import React from 'react'
import Paragraph from '../components/Paragraph/Paragraph'
import read from '@/actions/paragraphs/read'

export default async function Articles() {
    const para = await read('my_first_paragraph')
    return (
        <main>
            <Paragraph paragraph={para.data || null} />
        </main>
    )
}
