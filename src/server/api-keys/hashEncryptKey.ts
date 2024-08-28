import { hashAndEncrypter } from '@/auth/crypto/hashAndEncrypter'

export const {
    hashAndEncrypt: apiKeyHashAndEncrypt,
    decryptAndCompare: apiKeyDecryptAndCompare
} = hashAndEncrypter(process.env.API_KEY_SALT_ROUNDS, process.env.API_KEY_ENCRYPTION_KEY)
