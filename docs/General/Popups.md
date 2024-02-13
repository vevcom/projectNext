# Pop Ups
The popup system is quite important as it gives you flexibility to include a big element that appears on a click without ever having to worry about space.

## The pop up provider
When using a popup it might not feel like it but you are actually rallying on a PopUpProvider. The PopUpProvider simply holds a component (a popup) where it is placed. In this way popups really work like portals where the content (children) of a popup gets teleported to the nearest popupprovider. The rason for this defign is twofold: 
1. It provides a reasonable way to manage popups as one PopUpProvider can only "hold" one popup.
2. "Position: fixed" which popups really on have limitations in css. In some cases position: fixed is actually not relative to the viewport. So this design prevents styling issues.

**Warning:** One quite important consequence is that if you render children inside a PopUp component and you have a ContextProvider outside the PopUp, the children of the PopUp might not have access to the Context as the nearest PopUpProvider might lie outside the Context provider:
```html
<PopUpProvider> <!-- main layout PopUp provider -->
    <SomeContextChildrenNeed>
        <PopUp>
            ...children
        </PopUp>
    </SomeContextChildrenNeed>
</PopUpProvider>
```
*here the children will be rendered whenre the PopUpProvider is i.e outside the Context*
The soulution is to add a new PopUpProvide inside the context:
```html
<PopUpProvider> <!-- main layout PopUp provider -->
    <SomeContextChildrenNeed>
        <PopUpProvider> <!-- extra popup provider -->
            <PopUp>
                ...children
            </PopUp>
        </PopUpProvider> 
    </SomeContextChildrenNeed>
</PopUpProvider>
```

Even though it is important to understand that the PopUp component  works using PopUpProvider it is usually not integral for wring a popup using the PopUp component as it abstracts most of it. The main app layout already comes equiped with a PopUpProvider so unless you want to move it further down the component tree you do not need to place one yourself to use a PopUp.

## The PopUp component
The PopUp component is used to create a popup using PopUpProvider and PopUpContext. It takes:
1. **children** the content of the popup when it is open. (Placed in the nearest PopUpProvider)
2. **showButtonContent** The popup displays a button to open the popUp the content of this button can be set using this atribute.
3. **showButtonClass** A class-name to style the button to open the popUp.
4. **PopUpKey** A unique key to the popUp (it is the programmer using the popUp's job to ensure it is unique). This key is helt by the PopUp, and used by the PopUpProvider to manage what PopUps are open and not.

### Why the PopUpKey
**This is a technical explanation**
To understand why you need a key. We first note tha their can be many PopUp components inside a PopUpProvider at once, but only one can be displayed by that provider at any one given time. When a PopUp asks the PopUpProvider to set itself as the current PopUp being displayed in the provider it calls popUpContext.teleport(content, PopUpKey) This makes it so PopUpProvider immediately displays the content as a popup and keeps the PopUpKey in state keyOfCurrentNode. Now the PopUp can close itself calling popUpContext.remove(PopUpKey). **If** the PopUpKey matches the state keyOfCurrentNode in the PopUpProvider it removes the popup, else it ignores it. Now what would have happened without the key: well there is really no way for a PopUp component to know if it is actually being displayed so if a PopUp that was not being displayed called popUpContext.remove() it could clear another PopUp.
