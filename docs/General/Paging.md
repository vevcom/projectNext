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


## The paging generator and paging contexts


