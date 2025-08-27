import { Smorekopp } from './services/error'
import type { ReactNode } from 'react'

export function serverSidePage<Data>(
    serviceMethod: () => Promise<Data>,
    render: (data: Data) => ReactNode
) {
    return async () => {
        try {
            const data = await serviceMethod()
            return render(data)
        } catch (error) {
            if (error instanceof Smorekopp) {
                return <></> //ERROR COMPONENT
            }
            return <></> // ERROR COMPONENT
        }
    }
}
