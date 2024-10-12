import type { SearchParamsServerSide } from './Types'

export abstract class QueryParam<Type> {
    public name: string

    constructor(name: string) {
        this.name = name
    }

    abstract encode(value: Type): string
    public encodeUrl(value: Type): string {
        return `?${this.name}=${encodeURIComponent(this.encode(value))}`
    }
    abstract decodeValue(value: string | string[] | undefined): Type | null
    public decode(searchParams: SearchParamsServerSide['searchParams']): Type | null {
        if (!searchParams) {
            return null
        }
        if (!searchParams[this.name]) {
            return null
        }
        return this.decodeValue(searchParams[this.name])
    }
}

export class StringQueryParam extends QueryParam<string> {
    encode(value: string): string {
        return value
    }

    decodeValue(value: string | string[] | undefined): string | null {
        if (typeof value === 'string') {
            return value
        }

        return null
    }
}

export class StringArrayQueryParam extends QueryParam<string[]> {
    encode(value: string[]): string {
        return value.join(',')
    }

    decodeValue(value: string | string[] | undefined): string[] | null {
        if (Array.isArray(value)) {
            return value
        }
        if (typeof value === 'string') {
            return value.split(',')
        }
        return null
    }
}
