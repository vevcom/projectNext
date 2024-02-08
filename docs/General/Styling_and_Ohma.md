# Ohma and our styling system
By styling we mean modifying how the UI looks. We use scss which is a simple superset of css that compiles to css on build time. It adds quite a bit of functionality to css so you should get familiar with it, but note all css is valid scss.

## scss modules
We use scss modules, marked by their .module.scss extension. One important thing scss provides us is modularity. When writing a module file, tha class names get converted to a unique name accessible as an imported object. In your module.scss file you can have:
```css
.myClass {
    display: grid;
    place-items: center;
}
```
You can then import the module:
```javascript
import styles from './filename.module.scss'
```
Note that you may call the styles object whatever but our convention is to call it styles. You may now access the class in the jsx by:
```jsx
<div className={styles.myClass}>
    scss is super
</div>
```
when doing styles.myClass you get a string with the className that scss compiled the name to. This change of names is how scss modules make sure that one class in one module file cannot have its styles applied some other random place on the page. That is: in to different components with two different module.scss files you might have the same class-name but these will not conflict as the sass compiler changes their names.

### naming conventions and structure
1. We only style on classes and tags inside classes, not on ids.
2. we use camel vase in scss names. Even though this is non standard in css it keeps the jsx in accordance with js standards.
3. Each react component (and page, layout, etc.) comes with a module.scss file with the same name in the same directory.
4. The "first" class name in any component should be the name of the component (in PascalCase), except for in page components, then the "first" class name is .wrapper

## ohma
Ohma is where we place shared styling that all modules can use. Since scss has variables and mixins this is quite a useful feature. Ohma consists of several files in the /styles folder:
1. **_colors.scss** has all colors and sets two colors: $primary and $secondary. It is recomended to not use ohma.$colors-yellow but ohma.$colors-primary unless you want something to be constantly yellow. The $primary color provides an easy way for us to change the color later.
2. **_fonts.scss** contains our $primary and $secondary fonts imported using @font-face and served from the /public folder. It also has font-weights and sizes.
3. **_mixins.scss** Contains useful groupings of syling like ohma.card() which is a standard rounded card with padding. Note that it often exists a styled component with the same styling. For example applying the mixin ohma.borderBtn() on a ```<button />``` is the same as using the ```<BorderButton />``` component, in these cases it is recommended to use the component.
4. **_variables.scss** contains other variables. Importantly the $mobileBreakpoint that is usful for medi queries. The navbar changes on this width for example.
5. **ohma** itself just forwards the files for use in modules. It prefixes the declarations in _colors and _fonts with colors- and fonts-

### using ohma
Using ohma in a module is super simple. Just say:
```css
@use '@/styles/ohma'
```
Note the use of the alias @/styles. After this all ohma variables and mixins are accessible on the ohma "object"

## The global file
Is the only "regular" non-module based stylesheet. It is applied to all pages eveywhere. Importantly it sets the font-size and -weight of the h-tags and p element using ohma and sets the font to the primary font globally. This means that using a ```<hX>``` or ```<p>``` tag will use standard font-sizes from ohma. 