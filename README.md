# Moon Router

A router plugin for Moon.

[![Build Status](https://travis-ci.org/KingPixil/moon-router.svg?branch=master)](https://travis-ci.org/KingPixil/moon-router)

### What?

Moon router lets you create basic routes that map to different components. Clicking a `router-link` will update the view, and updates the URL. To the user, it seems like going on a new URL, but in reality, they are on the same page.

### Install

With npm:

```bash
$ npm install moon-router
```

```js
var MoonRouter = require("moon-router");
Moon.use(MoonRouter)
```

With a CDN/Local:

```html
<script src="https://unpkg.com/moon-router"></script>
<script>
  Moon.use(MoonRouter);
</script>
```

### Usage

Initialize Moon router

```js
Moon.use(MoonRouter)
```

#### Creating Routes

**Before** you create your Moon instance, define your routes like this:
```js
var router = new MoonRouter({
  default: "/",
  map: {
    "/": "Root",
    "/hello": "Hello"
  }
});
```

This will map `/` to the `Root` component, and will map `/hello` to the `Hello` component.

The `default` route is `/`, if a URL is not found, Moon will display this route.

##### Dynamic Routes

Routes can also be dynamic, with support for query parameters, named parameters, and wildcards. These can be accessed via a `route` prop passed to the view component.

```js
var router = new MoonRouter({
  map: {
    "/:named": "Root", // `named` can be shown with {{route.params.named}}
    "/:other/parameter/that/is/:named": "Named",
    "/*": "Wildcard" // matches any ONE path
  }
});
```

* Named Parameters are in the `route.params` object
* Query Parameters are in the `route.query` object (`/?key=val`)

Just remember, to access the special `route` variable, you must state it is a prop in the component, like:

```js
Moon.component("Named", {
  props: ['route'],
  template: '<h1></h1>'
});
```

#### Define Components

After initializing Moon Router, define any components referenced.

```js
Moon.component("Root", {
  template: `<div>
    <h1>Welcome to "/"</h1>
    <router-link to="/hello">To /hello</router-link>
  </div>`
});

Moon.component("Hello", {
  template: `<div>
    <h1>You have Reached "/hello"</h1>
    <router-link to="/">Back Home</router-link>
  </div>`
});
```

You will notice the `router-link` component. This is by default, rendered as an `a` tag, and should **always be used** to link to routes. A class of `router-link-active` will be applied to the active link by default, unless another class is provided in `options.activeClass`.

When clicking on this link, the user will be shown the new route at the `router-view` component (see below), and will not actually be going to a new page.

#### Installing Router to Instance

When creating your Moon instance, add the Moon Router instance as the option `router`

```js
new Moon({
  el: "#app",
  router: router
});
```

```html
<div id="app">
  <router-view></router-view>
</div>
```

This will install the Moon Router to the Moon Instance, and when you visit the page, you will notice the URL changes to `/#/`

The `router-view` is a component that will display the current mapped route.

### License

Licensed under the [MIT License](https://kingpixil.github.io/license) By [Kabir Shah](https://kabir.ml)
