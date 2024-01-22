# Image System
The image system of which much of whose functionality is contained in /images route. Note that a distinction should be made between the image system, which is responsible for storing and rendering the images, many of which are uploaded by users at runtime, and images displayed using a CmsImage. To keep it short: a CmsImage is like a frame containing one image from the image system at any given time. Read more about CmsImages [here](/CMS_and_Articles.md)

## Storing a image on fs
A image is physically stored in the store volume, under the /images folder. This volume is accessible to both the main projectnext container responsible for storing user uploaded images, and nginx responsible for serving images stored. 

Projectnext by storing a image in its store/images folder, will also store the image in store volume so they are accessible to nginx for serving. The nginx container has access to the store through its usr/store directory. When nginx gets a request to /store/[rest] it will statically serve whatever content is in the store volume under "rest"

### Auth on store folder (NOT IMPLEMENTED)
Some of the content in the /store(/images) directory (volume) might be protected so (NOT IMPLEMENTED)

### seeding of images
The prisma service can also write (and read) to the store volume when it is running through its own folder called /store. This is necessary to seed the standard images that should always be in the image system. The seeder seedImages moves images stored in standard_images to store/images to map them to the volume together with creating a database record of all the images (see next paragraph). Note that the seeder must be rerun to again move the images from standard_images to the store. This can for example be done by rerunning the prismaService.

## storing a image in database
No image is literally stored in the database, but all images stored in store/images has a record in the database that contains: name, date uploaded, and importantly its fsLocation. The fsLocation field in a Image record is a filename that mirroring its filename in store/images. The server action responsible for uploading a image is /images/create.

## The Image component
The simple Image component is a simple component that takes a image object from the database and displays

## Storing images in multiple sizes
Since an image from the image system may be displayed in many different locations either direcly through the Image component or indirectly through the CmsImage component it is neccessary for performance reasons to be able to serve 

## Collections
All images belong to a ImageCollection (there is a model in the database called image_collections). Note that in the store/images directory (or volume) all images are stored in a completly flat manner to 

(NOT IMPLEMENTED:)
A collection also specifies who has access to read and modify images contained there. All images in a collection have the same auth requirements. One collection can for example be set to only display its images to all members, and only to be modified (delete images, update metadata, add images) for a certain committee.