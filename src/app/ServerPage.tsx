import type { Metadata } from 'next'
import type { ReactNode } from 'react'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export function ServerPage<Params = undefined, Data = undefined>({
    operation,
    metadata,
    render
}: {
    operation: ({ params, searchParams }: { params: Promise<Params>, searchParams: SearchParams }) => Promise<Data>,
    metadata: (data: Data) => Promise<Metadata>
    render: (data: Data) => ReactNode
}) {
    return {
        page: async (
            { searchParams, params }: { searchParams: SearchParams, params: Promise<Params> }
        ): Promise<ReactNode> => {
            //TODO: safely catch errors and redirect to error page
            const data = await operation({ searchParams, params })
            return <>{render(data)}</>
        },
        generateMetadata: async (
            { searchParams, params }: { searchParams: SearchParams, params: Promise<Params> }
        ): Promise<Metadata> => {
            try {
                const data = await operation({ searchParams, params })
                return metadata(data)
            } catch {
                return {
                    title: 'Omegaveven',
                    description: 'En feil oppsto under lasting av siden.'
                }
            }
        }
    }
}
