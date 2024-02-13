#### Prerequisites
To understand this chapter you need to be familiar with how we use [server actions](/Server_actions.md) and understand react contexts

# Paging
Paging in this project means reading a lot of data in batches, the displaying of these batches does not necessarily have to happen with paging (can for example also be an endless scroll - more on this later). The paging system is a system that includes actions, contexts, and component for displays. This doc will go through this in that order:

## A Paging action
A paging action is a [server action](/Server_actions.md), just like any other: It returns a (promise) of generic type ActionReturn<ReturnType>. The difference is that a "paging" server action will always take in *one* parameter of type ReadPageInput<PageSize extends number, InputDetailType>. Here is an example from image paging:
```javascript
export async function readPage<const PageSize extends number>(
    { page, details }: ReadPageInput<PageSize, {collectionId: number}>
) : Promise<ActionReturn<Image[]>> {
    ...code
}
```
Here we se that the ReturnType is Image[] (The return type should naturally always be an array of something). We see that the one parameter of type ReadPageInput<PageSize, {collectionId: number}> has two properties. page and details:
1. page.pageSize tells the action how many entries you want the action to read, i.e. how many entries you want to have in a page.
2. page.page tells the action which page number (0 indexing is convention) it should read. Note that this of course 

### It's a Generic function
Note also that the function is generic, readPage has a different overload for different numbers corresponding to different sizes of pages, but note that this number will be inferred by ts by the page you pass it. For example if calling:
```javascript
readPage({
    page: {
        pageSize: 10,
        page: 3,
    }
    details: {
        collectionId: 2,
    }
})
```
Typescript infers PageSize to be 10. Of course when using the readPage action one should always call the function with the same pageSize. If you first read page 0 with pageSize 10, then page 1 with pageSize 7 you will get entry 0-9 first, then 7-13 meaning you are overfetching. This is why we think of page actions as generic functions. You should only ever call it with one PageSize at a time. This might already sound complicated, but the paging contexts are there to help you with managing this (or make it even more complicated):

### How to implement one
Usually a paging action will just be implemented with a prisma find many and 
```javascript
{
    skip: page.pageSize*page
    take: pageSize
}
```

## The paging generator and paging contexts
On the frontend: in order to use a paging action, the paging context provides a layer of abstraction for using it effectively. When you want to use a Paging action you create a paging Context and provider, the way this is done is through the generatePagingProvider and generatePagingContext functions. Both of these are HOF that take in some data based on your specific paging action and return a pagingProvider and pagingContext respectively.

### The Context
First you need to generate the paging context. This generate function takes no arguments, but require that you specify two types. The ReturnType of your action (referred to as the Data type in the pagingContext) and the pageSize (note that PageSize here is the type not the js variable). In the following example the Data type is Image and PageSize type is 30:
```javascript
export type PageSizeImage = 30
export const ImagePagingContext = generatePagingContext<Image, PageSizeImage>()
```
Now you have a context that holds data of your specific type. The pagingContext includes the following: 
1. **state:** The current state of the context: state.data holds an array of type Data (array of type Image in the above example) state.loading if it is currently fetching a page, state.allLoaded if there is any more pages to load and state.page which is of type Page<PageSize> (the same type used in the paging action). The state.page holds info about what page to fetch next: state.page.page and the page size being used: state.page.pageSize, note that the pageSize must be of type PageSize (in the above example 30) so it is stuck holding a constant value: You are not allowed to reassaign it as typescript expects state.page to be of 
```javascript
type Page<PageSize extends number> = {
    readonly pageSize: PageSize,
    page: number,
}
```
where PageSize is now set to be a literal number. This solves the problem previously discussed on changing pagesize: When creating a pagingContext you fix the pagesize creating a robust way of working with paging.
2. **methods** the loadMore method simply lodes one more page by calling the page action using the state.page (discussed in 1) and details (provided in the provide see below), then it increments state.page.page or sets allLoaded to true. The refetch method refetches all the pages currently loaded one after another.

The context may be consumed as usual with useContext(ImagePagingContext) in this example.

### The Provider
Now that we have a way to generate our specific context. In our example: a context holding Data of Image type, we need a provider to actually wrap our app, manage the logic and the state. This is done using generatePagingProvider This HOF takes the "fetcher" you would like to use and the Context in an object. All type parameters can be inferred by ts. The fetcher function will usually just be your paging action. In our example:

```javascript
const fetcher = async (x: ReadPageInput<PageSizeImage, {collectionId: number}>) => {
    const ret = await readPage(x)
    return ret
}
const ImagePagingProvider = generatePagingProvider({ Context: ImagePagingContext, fetcher })
```
Note that the generatePagingProvider expects the fetcher to return Promise<ActionReturn<Data[]>> when the context has state of type Data, and it expects the input to have the same PageSize as the one provided to create the context. This makes the code robust, if you mess up ts will let you know.

### Using the Provider
The pagingProvider that you generate (in ou example ImagePagingProvider) take in four props:
1. **details:** Remember that a server action for paging takes in both a page and details. The details is an object with structure specific to the paging action in question (in our example the details type for the action is {collectionId: number}). If you change the details you give your provider it will cause a refetch, as it is expected that changing details means that the data lying on each page will change. This is an effective way to implement filtering: in our example, if you change collectionId from 1 to 2, the Provider will refetch all the data but now tell the server action it wants the images in collection number 2.

2. **children:** Just the UI inside of the provider, note of course that the context is only accessible from these children.

3. **serverRenderdData:** Gives the context info about what data has been prerendered on the server (see below)

4. startPage. A page that the action should start from. If you server render 1 page (the 0 index page). You should start on startPage.page = 1. startPage.pageSize must have type PageSize meaning you have to provided the right number else ts will complain at you. This is again to make sure you cannot change pageSize.

Here is use o ImagePagingProvider
```javascript
<ImagePagingProvider
    startPage={{
        pageSize: 30,
        page: 1,
    }}
    details={{ collectionId: collection.id }}
    serverRenderedData={images}
>
    <>Jsx here</>
</ImagePagingProvider>
```

## Paging wrappers: endless scroll and pagination
To go along with paging we have the EndlessScroll component that takes in a PagingContext and a renderer. Then it simply renders what is inside state.data of the context using your renderer. Here is an example: When the viewport reaches the bottom of endlessScroll it automatically calls .loadMore() on your context.

```javascript
<div className={styles.ListImagesInCollection}>
    {serverRendered} {/* should be rendered in the same way*/}
    <EndlessScroll
        pagingContext={ImagePagingContext}
        renderer={image => <ImageListImage key={image.id} image={image} disableEditing={disableEditing}/>}
    />
</div>
```

Pagination has not yet been implemented

## Server rendering and paging
When server rendering for example the first page you should call your paging action and render all on the server and pass the rendered JSX to for example a client component. Here is how the serverRendered data in the above example is passed:
```javascript
const readImages = await readPage({ 
    page: { pageSize, page: 0 }, 
    details: { collectionId: collection.id } 
})
if (!readImages.success) notFound()
const images = readImages.data
return (
    <ImageList serverRendered={
        images.map(image => <ImageListImage key={image.id} image={image} />)
    } />
)
```
Note how the serverRendered content is rendered in exactly the same way as in EndlessScroll.


