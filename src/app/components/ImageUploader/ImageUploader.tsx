

export default function ImageUploader() {
    async function upload(data: FormData) {
        'use server'
        const x = data.get('file')
    }
    return (
        <form action="/api/image">
            <input type="file" name="file" />
            <input type="submit" value="Upload" />
        </form>
    )
}
