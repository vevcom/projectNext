export function readJWTPayload(jwt: string): {
    iss: string,
    jti: string,
    aud: string,
    sub: string,
    iat: number,
    exp: number,
    email: string,
    name: string
} {
    const parts = jwt.split('.')
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8')
    return JSON.parse(payload)
}