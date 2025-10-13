export const maxImageFileSize = 100 * 1024 * 1024 // 100mb

export const maxImageCountInOneBatch = 10

export const imageSizes = {
    small: 180,
    medium: 360,
    large: 720,
}

export const avifConvertionOptions = {
    quality: 50,
    lossless: false,
    speed: 8, // default is 5
    chromaSubsampling: '4:2:0',
}

export const allowedExtensions = ['png', 'jpg', 'jpeg', 'heic', 'avif', 'webp']
