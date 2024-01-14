import React from 'react'
import Paragraph from '../components/Paragraph/Paragraph'
import read from '@/actions/paragraphs/read'

export default async function Articles() {
    const {success, data: paragraph, error} = await read('my_first_paragraph')

    //should never happen as default behaviour is to create if not found.
    if (!success || !paragraph) throw new Error(error ? error[0].message : 'something unexpected happen in loading paragraph') 
    
    return (
        <main>
            <Paragraph paragraph={paragraph} />
        </main>
    )
}
