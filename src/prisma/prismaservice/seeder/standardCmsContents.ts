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

const standardCmsContents : CmsContent = {
    cmsImages: [
        {
            name: 'frontpage_1',
            image: {
                connect: {
                    name: 'kappemann'
                }
            }
        },
        {
            name: 'frontpage_2',
            image: {
                connect: {
                    name: 'ov'
                }
            }
        }
    ],
    cmsParagraphs: []
}

export default standardCmsContents
