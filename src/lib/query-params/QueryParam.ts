import type { SearchParamsServerSide } from './types'

export abstract class QueryParam<Type> {
    public name: string

    constructor(name: string) {
        this.name = name
    }

    abstract encode(value: Type): string
    public encodeUrl(value: Type): string {
        return `${this.name}=${encodeURIComponent(this.encode(value))}`
    }
    abstract decodeValue(value: string | string[] | undefined): Type | null
    public decode(searchParams: Awaited<SearchParamsServerSide['searchParams']>): Type | null {
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

export class BooleanQueryParam extends QueryParam<boolean> {
    encode(value: boolean): string {
        return value ? 'true' : 'false'
    }

    decodeValue(value: string | string[] | undefined): boolean | null {
        if (typeof value === 'string') {
            return value === 'true'
        }
        return null
    }
}

export class NumberQueryParam extends QueryParam<number> {
    encode(value: number): string {
        return value.toString()
    }

    decodeValue(value: string | string[] | undefined): number | null {
        if (typeof value === 'string') {
            return parseInt(value, 10)
        }
        return null
    }
}
