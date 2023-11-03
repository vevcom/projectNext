'use client'

import { useFormStatus } from 'react-dom'
import create from '@/app/actions/images/create'

export default function ImageUploader() {
    const { pending }  = useFormStatus()
    return (
        <form action={create}>
            <input type="file" name="file" />
            <input type="submit" value="Upload" />
        </form>
    )
}
