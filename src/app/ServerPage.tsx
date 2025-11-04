import '@pn-server-only'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export function ServerPage<Params = undefined, Data = undefined>({
    operation,
    metadata,
    render
}: {
    operation: ({ params, searchParams }: { params: Promise<Params>, searchParams: SearchParams }) => Promise<Data>,
    metadata: (data: Data) => Metadata,
    render: (data: Data) => ReactNode
}) {
    return {
        page: async (
            { searchParams, params }: { searchParams: SearchParams, params: Promise<Params> }
        ): Promise<ReactNode> => {
            //TODO: safely catch errors and redirect to error page
            //TODO: call operation in a context - do not give it prisma!!!
            const data = await operation({ searchParams, params })
            return <>{render(data)}</>
        },
        generateMetadata: async (
            { searchParams, params }: { searchParams: SearchParams, params: Promise<Params> }
        ): Promise<Metadata> => {
            try {
                const data = await operation({ searchParams, params })
                const meta = metadata(data)
                return {
                    ...meta,
                    title: meta.title ? `${meta.title} | Omegaveven` : 'Omegaveven',
                    description: meta.description ?? 'Omegaveven - Sct. Omega Broderskabs nettside'
                }
            } catch {
                return {
                    title: 'Feil | Omegaveven',
                    description: 'En feil oppsto under lasting av siden.'
                }
            }
        }
    }
}
