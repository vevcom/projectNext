#### Prerequisites
To understand this chapter it is usful to understand [server actions](/Server_actions.md).

# Form Component
The Form component is a custom component that wraps a regular ```<form>```. It is supposed to be used with a [server action](./Server_Actions.md). It ads functionality to the regular form component like errors displaying, as well as styling to standardize forms throughout the app.

## How to use it
At the end of the day you can use it as a regular form with a action:
```tsx
<Form 
    successCallback={collectionCreatedCallback}
    title="Lag et album" 
    submitText="Lag album" 
    action={create}
>
    <TextInput label="navn" name="name" />
    <TextInput label="beskrivelse" name="description" />
</Form>
```
*Here I am also using other UI components like TextInput that is just a wrapper for the standart ```<input>``` with nice styling*

Remember that when using a  Form with a action it submits the form and the inputs are accessible as type FormData using the name attribute from the inputs. In this example submitting the form will call the create action and the action will receive a FormData variable with two fields: 'name' and 'description'. **Note that the form component adds the submit button itself**

## Props
These are the props Form take in:
1. **children** This can be whatever jsx you want, but usually consists of inputs
2. **title** A sting displayed on top
3. **submitText** *optional* What the submit button displays.
4. **submitColor** *optional* What color the submit button has
5. **confirmation** *optional* a object with text and bool that, if the bool is true, asks the user to press one more time to confirm, while displaying the confirmation.text.
6. **action** What server action to call on submit. It needs to return Promise<ActionReturn<T>> and take one optional param of type FormData.
7. **successCallback** Function that gets run after a submit calling rhe action returns sucess true. This callback has access to the data returned by the action.

## Using a Form as submit button
Note that since the Form always adds the submit button, it is completly valid to create a Form that has no input children. This essentially just a button:
```tsx
<Form
    action={update.bind(null, cmsParagraph.id).bind(null, content)}
    submitText="Oppdater"
    successCallback={() => {
        refresh()
    }}
/>
```

## EditableTextArea
The EditableTextArea is sometimes a good alternative to using a Form when you want the user to have the ability to edit some text directly. This component uses the Form component used the hood. [read more](./EditableTextArea.md)

## How it works
*This is a technical overview* 
The main technical part of the Form component is how it handles errors. When the action returns success false it lookas at what the error is in ActionReturn. If there is no error it gives a generalError. But if there are errors, it loops through them and maps them to the correct input field. If it does not find a field the error is connected to, it sets the error as "generalErrors".All generalErrors are displayed under the submit button while the errors connected to a field are displayed under their respective input field. The way the form matches a error of type ActionError to a field is by looking at tha "path" attribute and the name attribute of the errors and input fields respectively.

Thus it is important that the path property used when returning errors in an action maps to the apropriate input field, but note that this is how zod does it by default. As long as the names in the FormData (and thus the form) matches the names in the zod schema, zod will baseically do this for you. 

Here is an example action
```ts
const schema = zfd.formData({
    name: z.string().max(40).min(2).trim()
    description: z.string().max(500).min(2).trim()
})

const parse = schema.safeParse(rawdata)

if (!parse.success) {
    return { success: false, error: parse.error.issues }
}
```
Note how the schema field-names matches the Form field-names. So here returning parse.error.issues directly will have the path attribute in the correct format so the Form component can map the paths of the error(s) to the input-fields.
