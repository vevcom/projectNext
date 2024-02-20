# General Note on Using Server Actions
In this project we use server actions as a way to fetch data both on the client and server. You should think of server actions as a layer of abstraction between prisma and getting data.

The main thing that makes server actions quite unique is that you can call them both on the client and the server. They are also often used in forms i.e. they are called on form submission. Note that we have our own [Form component](./Form_Component.md)

## Structure
We write server actions in the src/actions directory. Here we have different routes that in large part reflect the structure of the database and urls. In each route you have 4 files Create, Read, Update, Destroy, each exporting at least one (default) function with the same name. Some might also export more for example to read more, less or slightly different data. For instance: readPage is a special type of read that you can learn about [here](./Paging.md)

## Return typing
All server actions should return generic type ```ActionReturn<ReturnType, DataGuarantee>``` declared in actions/Types.ts. ActionReturn just provides a known, standard way for the Client side (and when server uses server actions) to interact with serverActions, the [Form component](./Form_Component.md) for example expects a server action that has this generic return type.

When you get a response from a server action, i.e ```const res = read()``` you have two possibilities: 
1. res.success is true and you may access res.data. res.data will have type ReturnType, or
2. res.success is false and you may access res.error. res.error that is an array of type ActionError, also declared in actions/Types.ts. each error in the array has a message and may have a path. The path, when used, is supposed to be the name of the field (in a Form) that caused the problem

The DataGuarantee is just a bool that is true by default and not that important. It only says if you can always expect data if success is true.

## Crating server action
When using a server action called from a form you will get raw data of type FormData as one parameter. On this object you can access fields by ```rawData.get("prop")``` where prop is the name of the input inside a form. 

### using zod
To make this access of formData type-safe we use zod to validate. Here is an example of a zod schema:
```javascript
    const schema = z.object({
        name: z.string().max(40).min(2).trim(),
        description: z.string().max(500).min(2).trim(),
        id: z.number()
        email: z.string().email()
    })
```
Here you see that zod provides a way to validate more than just simple types. to parse data we use ```const parse = schema.safeParse({ [object matching schema] })``` To create the object you use: ```{... name: rawData.get("name") ...}``` for example. parse can either:
1. Return parse.success false Then you can just return success: false with error as parse.error.issues. Note that the error.issues returned by zod is assignable to our ActionError type.
2. success is true and you can access type-safe data on parse.data in accordance with your schema.

The rest of the action will be used to implement the specific functionality of the action, and will most likely include prisma calls.

### errorHandler
We usually wrap calls to prisma in try, catch. On catch we use errorHandler function to create an error that can be returned from the action. errorHandler checks for different types of prisma errors and gives an appropriate message as the error. If this is not a prisma error or the specific error has not been added to the functionality of the function, errorHandler will return a generic message, therefor you should be sure that errors given to errorHandler are most likely prisma errors.
