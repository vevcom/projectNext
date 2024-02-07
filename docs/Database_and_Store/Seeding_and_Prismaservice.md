# Seeding and the prismaservice
The prismaservice is responsible for running migrations and seeding the db both with dev test data, and with standard content projectnext needs to run. Seeding just means putting some data inside the database weather that is "standard data" or data used in development.
The prismaservice has also been responsible for migrations from the old veven (omegaweb basic): [read more](./Migrations_veven.md)

## structure
prismaservice is a completly (except schema.prisma) seperate project from projectnext. In production the Docker-container for projectnext does not include any of the code from the /prsimaservice directory and prismaservice does not include any code outside /prismaservice (except prisma). So remember that if you need a package for prismaservice you must install it inside the prismaservice directory. Your IDE might still belive that it can do imports from projectnext´s node_modules, but this will lead to problems when running prismaservice by itself in Docker. prisma and prisma/client is therefor also installed in both projects. Note however that schema.prisma is set up with two generators so locally running:
```bash
    npx prisma generate
```
will generate to both projects.

**Warning:** the Dockerfile might seam to use wrong paths when copying but this is because prismaservice is built from the context one level out from the Dockerfile, this is in order to have access to Schema.prisma for the build

The migrations are run through the Dockerile (NOT IMPLEMENTED, now its a db push by force). The Dockerfile also builds the seeder using tsc. The compiled code from prismacontainer/src gets moved to the /dist folder. When running prismaservice the compiled code from /dist gets executed, this will seed the db:

We have one entryfile seed.ts this file (function) just calls many others in order (note that the seeding order is sensitive here - you cannot seed cmsImages before images as one has a relation to another) The files in the main /src directory with names seed[part].ts are responsible for seeding "standard" data while the once in /development with seedDev[psrt].ts as names are responsible for seeding dummydata. The NODE_ENV set in docker-compose(.dev).yml is responsible for desiding if dev gets run or not.

## migrations
If someone changes the db structure a migration has to be created and run. NOT IMPLEMENTED

## Seeding the store
The projectnext container has access to the store volume through its /store directory, that is: whatever is moved into the /store appears in the store volume. In prismaservice's Dockerfile you can see that this directory is created on build. You can find what the content that will be placed into the /store in /standard_store. When prismaserice runs it will take the contnents of standard_store and move it to /store, and thereby to the volume.

### Images
Images are seeded using seedImages.ts This file both creates the db entries for standard images (and a standard ImageCollection), but also one by one right when it creates the db entry it also moves the image from /standard_store/images/[name] to /standard_store/images/[some id]. In other words the seeder takes all images located in standard_store/images and seeds them into the [image system](./Image_System.md). 

It is worth noting that the name of the image in the standard_store becomes the name of the image in the database, but the filename is changed by the seeder when the image-file is moved. This is important to note as when seeding a cms image (see next section) you must provide the name of the image you initially want to connect to the cmsImage. So when providing a imageName for a cmsImage to be seeded, make sure it matches the name of one of the images in /standard_store/images, else prismaservice throws an error on runtime.

## Seeding cms
*Read more on cms [cms](../Content_Managment_System/Basic_CMS.md)*
Seeding of the cms is naturally done through the seedCms.ts file as per our convention layed out in this document. However this seedCms function really only reads the content of the standardCmsContents from the file with the same name. This function exports an object that allows you to write the standard contents of the cms in a declerative, type-safe way.

It includes all basic elements: cmsImages, cmsParagraphs and cmsLinks. Note that for example adding a object to cmsImages creates a "lonely" cmsImage with no relation to any articleSection or article. Providing a cmsImage in an articleSection is done inside a articleSection. Likevise all articleSections spesified in the articleSections atribute of standardCmsContents will not have a relation to a article. You specify all the articleSections belonging to a article inside the article.

### Example
```javascript
const standardCmsContents : CmsContent = {
    cmsImages: [
        {
            name: 'frontpage_logo',
            imageName: 'logo_white',
            imageSize: 'LARGE'
        },
        {
            name: 'frontpage_1',
            imageName: 'kappemann',
        },
    ],
    cmsParagraphs: [
        {
            name: 'para1',
            file: 'helloWorld/hello.md'
        }
    ],
    cmsLink: [
        cmsLink: {
            name: 'random_link',
            url: 'https://github.com/JohanHjelsethStorstad',
        }
    ],
    articleSections: [
        {
            name: 'tjoho',
            cmsParagraph: {
                name: 'tjoho_paragraph',
                file: 'tjoho/tjoho_1.md'
            },
            cmsLink: {
                name: 'tjoho_1_link',
                url: 'https://omega.ntnu.no',
            }
        },
    ],
    articles: [
        {
            name: 'om omega',
            category: 'news',
            description: 'ny vev',
            coverImage: {
                name: 'about_cover',
                imageName: 'ohma',
                imageSize: 'LARGE'
            },
            articleSections: [
                {
                    name: 'about_1',
                    cmsParagraph: {
                        name: 'about_1_paragraph',
                        file: 'about/about_1.md'
                    },
                    cmsLink: {
                        name: 'about_1_link',
                        url: 'https://omega.ntnu.no',
                    }
                },
                {
                    name: 'about_2',
                    cmsParagraph: {
                        name: 'about_2_paragraph',
                        file: 'about/about_2.md'
                    },
                    cmsImage: {
                        name: 'about_2_image',
                        imageName: 'kappemann',
                        imageSize: 'LARGE'
                    }
                }
            ]
        },
        {
            name: 'statutter',
            category: 'guides',
            coverImage: {
                name: 'statutter_cover',
                imageName: 'ov',
                imageSize: 'MEDIUM'
            },
            articleSections: [
                {
                    name: 'statutter_1',
                    cmsParagraph: {
                        name: 'statutter_1_paragraph',
                        file: 'statutter/statutter_1.md'
                    },
                    cmsLink: {
                        name: 'statutter_1_link',
                        url: 'https://omega.ntnu.no',
                    }
                },
                {
                    name: 'statutter_2',
                    cmsParagraph: {
                        name: 'statutter_2_paragraph',
                        file: 'statutter/statutter_2.md'
                    },
                    cmsImage: {
                        name: 'statutter_2_image',
                        imageName: 'traktat',
                        imageSize: 'MEDIUM'
                    }
                }
            ]
        }
    ]
}
```
Note how the article "om omega" contains its sections and all of these sections again contain cmsImages, cmsLinks and cmsParagraphs. The articleSection "tjoho" will here be added with no relation to any article

Note also that each article also has a catepory. This can be 
1. a standardArticleCategory decleared in the same file, in which case it will get seeded into with a relation to that category, or
2. "news" in which case a NewsArticle will also be created that links to the article. When using category: "news" we also need to specify description which is the description in the newsArticle model.

Finally se that every cmsParagraph points to a .md file This is the location of the file inside the /cms_paragraphs directory. And will be the content of the paragraph.