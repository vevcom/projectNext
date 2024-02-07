# Seeding and the prismaservice
The prismaservice is responsible for running migrations and seeding the db both with dev test data, and with standard content projectnext needs to run.
The prismaservice has also been responsible for migrations from the old veven (omegaweb basic): [read more](./Migrations_veven.md)

## structure

## migrations
If someone changes the db structure a migration has to be created and run. NOT IMPLEMENTED

## Seeding the store
The projectnext container has access to the store volume through its /store directory, that is: whatever is moved into the /store appears in the store volume. In prismaservice's Dockerfile you can see that this directory is created on build. You can find what the content that will be placed into the /store in /standard_store. When prismaserice runs it will take the contnents of standard_store and move it to /store, and thereby to the volume.

### Images
Images are seeded using seedImages.ts This file both creates the db entries for standard images (and a standard ImageCollection), but also one by one right when it creates the db entry it also moves the image from /standard_store/images/[name] to /standard_store/images/[some id]. In other words the seeder takes all images located in standard_store/images and seeds them into the [image system](./Image_System.md). 

It is worth noting that the name of the image in the standard_store becomes the name of the image in the database, but the filename is changed by the seeder when the image-file is moved. This is important to note as when seeding a cms image (see next section) you must provide the name of the image you initially want to connect to the cmsImage. So when providing a imageName for a cmsImage to be seeded, make sure it matches the name of one of the images in /standard_store/images, else prismaservice throws an error on runtime.

## Seeding cms
*Read more on cms [cms](../Content_Managment_System/Basic_CMS.md)*
Seeding of the cms is naturally done through the seedCms.ts file as per our convention layed out in this document. However this seedCms function really only reads the content of the standardCmsContents 
