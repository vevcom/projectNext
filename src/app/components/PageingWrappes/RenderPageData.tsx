import type { JSX } from 'react'

type PropTypes<Data> = {
    data: Data[],
    renderer: (data: Data) => JSX.Element,
}

export default function RenderPageData<Data>({ data, renderer }: PropTypes<Data>) {
    return data.map(renderer)
}
