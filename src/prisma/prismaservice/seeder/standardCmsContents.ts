type CmsContent = {
    cmsImages: {
        name: string,
        image: {
            connect: {
                name: string
            }
        }
    }[],
    cmsParagraphs: {
        name: string,
        text: string
    }[]
}

const standardCmsContents = {
    cmsImages: [
        {
            name: 'frontpage_1',
            image: {
                connect: {
                    name: 'kappemann'
                }
            }
        }
    ],
    cmsParagraphs: {

    }
}

export default standardCmsContents
