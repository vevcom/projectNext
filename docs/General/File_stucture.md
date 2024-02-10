# File structure

## config
All project (global) config file lie in the root directory

## The public folder
Next uses the public folder to serve static assets. Our fonts are inside this directory. When navigating to /something/blabla in the browser next will try to serve what is in the public directory under /something/blabla as a static asset.

**Warning:** The public folder is created at runtime and is **not** suitable for serving user uploaded content. This is nginx and the store volume's job. You might see many project's serving images from /public. This is not how we do it as we have our own [image system](../Database_and_Store/Image_System.md)

## The node_modules folder
(*gitignored*)
Contains the dependencies of the project. This is just something excising locally in your environment. The modules can always be reinstalled using package(-lock).json and 
```bash
    npm ci
```
## The Docs folder
Contains the docs

## The .next folder
(*gitignored*)
This folder contains a build of the next project. If you run npm run build (next build) the build is placed in this directory.

## The .github folder
Gives github info on how to run [workflows](./Workflows.md)

## The src folder
All src code (except the things in /public) is in the src folder. All code is written in the src folder:
### /typings
Contains global type declarations (.d.ts files). Note that you seldom want to make declarations this way. Most utility types that are somewhat limited in scope should be declared in another directory and exported using a regular export statement and a regular: ([fileanme.ts]) file. Returntypes for actions are for example declared and exported in the same dir. as the actions using it in a ReturnType.ts file.
### /styles
Contains our [ohma style system](./Styling_and_Ohma.md) and the global style sheet applied to all pages and component. Never use this directory for anything else than adding utility to ohma. A module.scss file should never be in this directory but contained in the same dir. as the component it styles.
### /prisma
The root of prismaservice contains the db schema and a file that exports a prisma instance. It also contains the errorHandler important to handle errors in [server actions](./Server_Actions.md). The /prismaservice folder contains a completely different project [read more](../Database_and_Store/Seeding_and_Prismaservice.md).
### /hooks
Contains custom react hooks. Familiarize yourself with these as they often implement quite useful functionality. 
### /context
Contains contexts. Never create a context in any other directory. context/paging contains one main generator and many different specific pagingContexts. Follow the naming conventions of context providers, contexts, and paging carefully.
### /auth
Contains setup needed for next-auth like auth-providers.
### /app
The directory containing all the pages and UI (basically the entire frontend). See more on this further down.
### /actions
Think of this as the backend. It contains all the actions in the project. You should never write a server action in a component even though it is technically possible. Our convention is to have all server actions in the action folder. The actions folders has structure that sort of mimic a standard web-api (of course it is not, but pretend it is for now) Each directory contains each of the CRUD operations, and each of the files export functions that for example:
1. **create:** creates one, creates many
2. **read:** read many, read one, read a [page](./Paging.md)
3. **update:** chang a field change/add a relation.
4. **destroy:** remove a record. 

A file does not have a default export in this folder.
[read more about actions](./Server_Actions.md)

## Details on the app-directory
This is our frontend (but of course since this is next.js much of it run server-side). But still the /app directory concerns itself with UI. Most folders are literally pages on our webside. These are the directories with a page.tsx file in them (read more on this in the next.js docs). There are some important exceptions:
1. **components:** contains components used on multiple pages. You may still have components located outside the component dir. but these are then (by convention) only meant to be used by that particular page. The Image and CmsImage components are for example in the /component folder as they are used all over the place, but the component MakeNewImageCollection is only used in /images page so it is located in this dir. and not in components.
2. **api:** this contains standard api routes. next-auth requires an api route (we do not really use this). With the excaption of kiolesabet (NOT IMPLEMENTED ??)

Note the use /(blabla) directories to group pages without having an effect on the next routing (see the next documentation).
### filenames and conventions in /app
All components (weather in the /components dir. or not) has a capitalized filename that is the same as the default export react-function-component name. The file usually comes with a scss module file with the same name [read more](./Styling_and_Ohma.md)
For next specific files like page.tsx, layout.tsx, template.tsx, error.tsx, ..., We still export default a react-function-component but here not with the name of the file but with another **capitalized**, suitable name. The styling file still has the same name as the file containing the component.
 
## Aliases
In tsconfig.json you can find aliases that you can use. These provide an easy way to do impor statments. Instead of:
```javascript
    import { readImage } from '../../../actions/images/read'
```
We have an alias for actions. So we say instead:
```javascript
    import { readImage } from '@/actions/images/read'
```