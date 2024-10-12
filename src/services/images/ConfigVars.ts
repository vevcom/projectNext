export const maxFileSize = 100 * 1024 * 1024 // 100mb

export const maxNumberOfImagesInOneBatch = 10

export const imageSizes = {
    small: 180,
    medium: 360,
    large: 720,
}

export const avifOptions = {
    quality: 50,
    lossless: false,
    speed: 8, // default is 5
    chromaSubsampling: '4:2:0',
}

export const allowedExtImageUpload = ['png', 'jpg', 'jpeg', 'heic', 'avif', 'webp']
