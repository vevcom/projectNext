type CmsContent = {
    cmsImages: {
        name: string,
        imageName: string
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
            imageName: 'kappemann',
        },
        {
            name: 'frontpage_2',
            imageName: 'ov', 
        }
    ],
    cmsParagraphs: []
}

export default standardCmsContents
