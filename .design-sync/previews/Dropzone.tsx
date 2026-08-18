import { Dropzone } from '@ohma/ui'
import { useEffect, useState } from 'react'

// Mirrors Dropzone's own FileWithStatus (the barrel exports components, not types).
type FileWithStatus = { file: File, uploadStatus: 'pending' | 'uploading' | 'done' | 'error' }

const SAMPLES: { name: string, fill: string, status: FileWithStatus['uploadStatus'] }[] = [
    { name: 'immatrikulering-01.png', fill: '#037FFC', status: 'done' },
    { name: 'immatrikulering-02.png', fill: '#5cd17a', status: 'uploading' },
    { name: 'immatrikulering-03.png', fill: '#e6e64d', status: 'pending' },
    { name: 'immatrikulering-04.png', fill: '#eb5757', status: 'error' },
]

// Dropzone renders each file as an <img src={URL.createObjectURL(file)}>, so the
// previews need genuinely decodable image bytes — canvas gives us that, at a
// realistic size, without checking a binary fixture into the repo.
function usePngFiles(): FileWithStatus[] {
    const [files, setFiles] = useState<FileWithStatus[]>([])
    useEffect(() => {
        let cancelled = false
        Promise.all(SAMPLES.map(({ name, fill, status }) => new Promise<FileWithStatus>(resolve => {
            const canvas = document.createElement('canvas')
            canvas.width = 320
            canvas.height = 320
            const context = canvas.getContext('2d')!
            context.fillStyle = fill
            context.fillRect(0, 0, 320, 320)
            context.fillStyle = 'rgba(0,0,0,0.35)'
            context.fillRect(0, 220, 320, 100)
            canvas.toBlob(blob => {
                resolve({ file: new File([blob!], name, { type: 'image/png' }), uploadStatus: status })
            }, 'image/png')
        }))).then(result => { if (!cancelled) setFiles(result) })
        return () => { cancelled = true }
    }, [])
    return files
}

export const Empty = () => {
    const [files, setFiles] = useState<FileWithStatus[]>([])
    return (
        <Dropzone
            name="images"
            label="Slipp bilder her, eller klikk for å velge"
            files={files}
            setFiles={setFiles}
        />
    )
}

export const WithFiles = () => {
    const initial = usePngFiles()
    const [files, setFiles] = useState<FileWithStatus[]>([])
    useEffect(() => setFiles(initial), [initial])
    return (
        <Dropzone
            name="images"
            label="Slipp bilder her, eller klikk for å velge"
            files={files}
            setFiles={setFiles}
        />
    )
}
