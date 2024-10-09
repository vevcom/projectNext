import type { SearchParamsServerSide } from './Types'

export const stringDecoder = (raw: SearchParamsServerSide['searchParams']) => {
    if (typeof raw !== 'string') {
        return null
    }
    return raw
}

export const stringArrayDecoder = (raw: SearchParamsServerSide['searchParams']) => {
    if (!Array.isArray(raw)) {
        return null
    }
    return raw
}
