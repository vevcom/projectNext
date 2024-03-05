# General Note on Using Server Actions
In this project we use server actions as a way to fetch data both on the client and server. You should think of server actions as a layer of abstraction between prisma and getting data.

The main thing that makes server actions quite unique is that you can call them both on the client and the server. They are also often used in forms i.e. they are called on form submission. Note that we have our own [Form component](./Form_Component.md)

## Structure
We write server actions in the src/actions directory. Here we have different routes that in large part reflect the structure of the database and urls. In each route you should have 4 files: `create.ts`, `read.ts`, `update.ts`, and `destroy.ts`. Each action should be placed in the file that most aligns with their intention and named accordingly. For some actions this is obvious. For example, for reading user data the actions would be named `readUser` or `readUserPage` (which you can learn more about [here](./Paging.md)) and should go in the `read.ts` file. Less obvious actions should go into the `update.ts`.

## Return typing
All server actions should return generic type ```ActionReturn<ReturnType, DataGuarantee>``` declared in actions/Types.ts. ActionReturn just provides a known, standard way for the Client side (and when server uses server actions) to interact with serverActions, the [Form component](./Form_Component.md) for example expects a server action that has this generic return type.

When you get a response from a server action, i.e ```const res = read()``` you have two possibilities: 
1. res.success is true and you may access res.data. res.data will have type ReturnType, or
2. res.success is false and you may access res.error. res.error that is an array of type ActionError, also declared in actions/Types.ts. each error in the array has a message and may have a path. The path, when used, is supposed to be the name of the field (in a Form) that caused the problem

The DataGuarantee is just a bool that is true by default and not that important. It only says if you can always expect data if success is true.

## Creating server action
The most important thing to remember when writing server actions it that they should *always* return a value. They should *nevner* throw an error because this will result in an unmanagable 500 error (internal server error) on the client side.

Arguments a server action takes in can be anything you want really. They act simply as any other function in typescript/javascript. However, we have an exception when it comes to server actions used by our own form component.

When it comes to server actions called from a form we have a recommended approach for this project to simplify and standardize the process. When a server action is called from a form component it will get raw data of the type FormData as it's parameter. This object is not type-safe. To deal with this we use a library called `zod` (in addition we use `zod-form-data` to handle formData more elegantly).

### using zod
To make property access of formData type-safe we use `zod` to validate all the properties we wish to use. Zod works by creating something called a 'schema', basically a layout of how we want the object to look like. Inside this layout we can specify types (or even restrictions) using function calls like `z.string()` or `z.number()`. For form data we specifically use the schema `formData` from the library `zod-form-data` as it can take in a from data object directly. Here is an example of a zod schema:
```ts
    const schema = zfd.formData({
        name: z.string().max(40).min(2).trim(),
        description: z.string().max(500).min(2).trim(),
        id: z.number()
        email: z.string().email()
    })
```
Here you see that zod provides a way to validate more than just simple types. To parse data we use `const parse = schema.safeParse([object matching schema])` Parse can either:
1. Return parse.success false Then you can just return success: false with error as parse.error.issues. Note that the error.issues returned by zod is assignable to our ActionError type.
2. success is true and you can access type-safe data on parse.data in accordance with your schema.

The rest of the action will be used to implement the specific functionality of the action, and will most likely include prisma calls.

### errorHandler
We usually wrap calls to prisma in try, catch. On catch we use errorHandler function to create an error that can be returned from the action. errorHandler checks for different types of prisma errors and gives an appropriate message as the error. If this is not a prisma error or the specific error has not been added to the functionality of the function, errorHandler will return a generic message, therefor you should be sure that errors given to errorHandler are most likely prisma errors.
