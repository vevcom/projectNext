
export type OmegaId = {
    id: number
}

export type OmegaIdJWT = {
    iat: number,
    exp: number,
    sub: OmegaId['id'],
}
