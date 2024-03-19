export const maxImageSize = 540
export const minImageSize = 130
export const imageSizeIncrement = 20

export const articleSectionsRealtionsIncluder = {
    cmsImage: {
        include: {
            image: true
        }

    },
    cmsParagraph: true,
    cmsLink: true
} as const
