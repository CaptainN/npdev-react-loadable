![React Loadable](http://thejameskyle.com/img/react-loadable-header.png)

A higher order component for loading components with dynamic imports. This is a direct port from the original `react-loadable` project to Meteor.

Meteor has a few different requirements for making this all work, and some incompatibilities with the original `react-loadable` when it comes to server side rendering (SSR). This fork addresses those issues, while also streamlining some of the APIs. The examples in this readme have also been updated for Meteor.

## Install

```sh
meteor add npdev:react-loadable
```

## Example

```js
import { Loadable } from 'meteor/npdev:react-loadable';
import Loading from './my-loading-component';

const LoadableComponent = Loadable({
  loader: () => import('./my-component'),
  loading: Loading,
});

export default class App extends React.Component {
  render() {
    return <LoadableComponent/>;
  }
}
```

## Happy Customers:

- ["I'm obsessed with this right now: CRA with React Router v4 and react-loadable. Free code splitting, this is so easy."](https://twitter.com/matzatorski/status/872059865350406144)
- ["Oh hey - using loadable component I knocked 13K off my initial load. Easy win!"](https://twitter.com/AdamRackis/status/846593080992153600)
- ["Had a look and its awesome. shaved like 50kb off our main bundle."](https://github.com/quran/quran.com-frontend/pull/701#issuecomment-287908551)
- ["I've got that server-side rendering + code splitting + PWA ServiceWorker caching setup done 😎 (thanks to react-loadable). Now our frontend is super fast."](https://twitter.com/mxstbr/status/922375575217627136)
- ["Using react-loadable went from 221.28 KB → 115.76 KB @ main bundle. Fucking awesome and very simple API."](https://twitter.com/evgenyrodionov/status/958821614644269057)
- ["We've reduced our entry chunk by a lot & reduced initial load time by ~50%!"](https://github.com/jamiebuilds/react-loadable/pull/181)
- ["React-loadable is killer! We've decreased our load size by over 50kb with only 2 files! Can't wait to see how much lower it will go."](https://github.com/jamiebuilds/react-loadable/pull/180/)

## Users

- [AdHawk / Flooring Stores](https://www.flooringstores.com)
- [Akutbolig.dk](https://www.akutbolig.dk)
- [Analog.Cafe](https://www.analog.cafe)
- [Ambrosus](https://ambrosus.com)
- [Appbase.io](https://github.com/appbaseio/reactivesearch)
- [Atlassian](https://www.atlassian.com/)
- [BBC News](https://github.com/BBC-News/simorgh)
- [Blytzpay](https://www.blytzpay.com)
- [ClearTax](https://cleartax.in)
- [Cloudflare](https://www.cloudflare.com)
- [Chibaki](https://chibaki.co)
- [Curio](https://www.curio.org)
- [Delivery.com](https://www.delivery.com)
- [Doctor.com](https://www.doctor.com/)
- [Dollar Shave Club](https://github.com/dollarshaveclub)
- [Dresez](https://dresez.pk/)
- [Evidation Health](https://evidation.com/)
- [Flyhomes](https://flyhomes.com)
- [Gogo](https://gogoair.com)
- [Gofore](https://gofore.com/en/home/)
- [Graana](https://www.graana.com/)
- [Localie](https://localie.co/en)
- [MediaTek MCS-Lite](https://github.com/MCS-Lite)
- [NiYO Solutions Inc.](https://www.goniyo.com/)
- [NP Dev](https://www.npdev.io/)
- [Officepulse](https://www.officepulse.in/)
- [Perx](https://www.perxtech.com/)
- [Pixstori](https://www.pixstoriplus.com/)
- [Plottu](https://public.plottu.com)
- [Render](https://render.com)
- [Shift](https://shift.com)
- [Snipit](https://snipit.io)
- [Spectrum.chat](https://spectrum.chat)
- [Talentpair](https://talentpair.com)
- [Tinder](https://tinder.com/)
- [Unsplash](https://unsplash.com/)
- [Wave](https://waveapps.com/)
- [WUZZUF](https://wuzzuf.net/)

> _If your company or project is using React Loadable, please open a PR and add
> yourself to this list (in alphabetical order please)_

## Also See:

- [`react-loadable-visibility`](https://github.com/stratiformltd/react-loadable-visibility) - Building on top of and keeping the same API as `react-loadable`, this library enables you to load content that is visible on the screen.

<h2>
  <hr>
  <hr>
  <img src="http://thejameskyle.com/img/react-loadable-guide.png" alt="GUIDE">
  <hr>
  <hr>
  <small>Guide</small>
</h2>

So you've got your React app, you're bundling it with Meteor, and things are
going smooth. But then one day you notice your app's bundle is getting so big
that it's slowing things down.

It's time to start code-splitting your app!

![A single giant bundle vs multiple smaller bundles](http://thejameskyle.com/img/react-loadable-split-bundles.png)

Code-splitting is the process of taking one large bundle containing your entire
app, and splitting them up into multiple smaller bundles which contain separate
parts of your app.

This might seem difficult to do, but tools like Meteor have this built in, and
React Loadable is designed to make it super simple.

### Route-based splitting vs. Component-based splitting

A common piece of advice you will see is to break your app into separate routes
and load each one asynchronously. This seems to work well enough for many apps–
as a user, clicking a link and waiting for a page to load is a familiar
experience on the web.

But we can do better than that.

Using most routing tools for React, a route is simply a component. There's
nothing particularly special about them (Sorry Ryan and Michael– you're what's
special). So what if we optimized for splitting around components instead of
routes? What would that get us?

![Route vs. component centric code splitting](http://thejameskyle.com/img/react-loadable-component-splitting.png)

As it turns out: Quite a lot. There are many more places than just routes where
you can pretty easily split apart your app. Modals, tabs, and many more UI
components hide content until the user has done something to reveal it.

> **Example:** Maybe your app has a map buried inside of a tab component. Why
> would you load a massive mapping library for the parent route every time when
> the user may never go to that tab?

Not to mention all the places where you can defer loading content until higher
priority content is finished loading. That component at the bottom of your page
which loads a bunch of libraries: Why should that be loaded at the same time as
the content at the top?

And because routes are just components, we can still easily code-split at the
route level.

Introducing new code-splitting points in your app should be so easy that you
don't think twice about it. It should be a matter of changing a few lines of
code and everything else should be automated.

### Introducing React Loadable

React Loadable is a small library that makes component-centric code splitting
incredibly easy in React.

`Loadable` is a higher-order component (a function that creates a component)
which lets you dynamically load any module before rendering it into your app.

Let's imagine two components, one that imports and renders another.

```js
import Bar from './components/Bar';

class Foo extends React.Component {
  render() {
    return <Bar/>;
  }
}
```

Right now we're depending on `Bar` being imported synchronously via `import`,
but we don't need it until we go to render it. So why don't we just defer that?

Using a **dynamic import** ([a tc39 proposal currently at Stage 3](https://github.com/tc39/proposal-dynamic-import))
we can modify our component to load `Bar` asynchronously.

```js
class MyComponent extends React.Component {
  state = {
    Bar: null
  };

  componentDidMount() {
    import('./components/Bar').then(Bar => {
      this.setState({ Bar: Bar.default });
    });
  }

  render() {
    let {Bar} = this.state;
    if (!Bar) {
      return <div>Loading...</div>;
    } else {
      return <Bar/>;
    };
  }
}
```

But that's a whole bunch of work, and it doesn't even handle a bunch of cases.
What about when `import()` fails? What about server-side rendering?

Instead you can use `Loadable` to abstract away the problem.

```js
import { Loadable }  from 'meteor/npdev:react-loadable';

const LoadableBar = Loadable({
  loader: () => import('./components/Bar'),
  loading() {
    return <div>Loading...</div>
  }
});

class MyComponent extends React.Component {
  render() {
    return <LoadableBar/>;
  }
}
```

### Automatic code-splitting on `import()`

When you use `import()` with Meteor 1.5+, it will
[automatically code-split](https://blog.meteor.com/dynamic-imports-in-meteor-1-5-c6130419c3cd) for
you with no additional configuration.

This means that you can easily experiment with new code splitting points just
by switching to `import()` and using React Loadable. Figure out what performs
best for your app.

### Creating a great "Loading..." Component

Rendering a static "Loading..." doesn't communicate enough to the user. You
also need to think about error states, timeouts, and making it a nice
experience.

```js
function Loading() {
  return <div>Loading...</div>;
}

Loadable({
  loader: () => import('./WillFailToLoad'), // oh no!
  loading: Loading,
});
```

To make this all nice, your [loading component](#loadingcomponent) receives a
couple different props.

#### Loading error states

When your [`loader`](optsloader) fails, your [loading component](#loadingcomponent)
will receive an [`error`](propserror) prop which will be an `Error` object (otherwise it
will be `null`).

```js
function Loading(props) {
  if (props.error) {
    return <div>Error!</div>;
  } else {
    return <div>Loading...</div>;
  }
}
```

#### Avoiding _Flash Of Loading Component_

Sometimes components load really quickly (<200ms) and the loading screen only
quickly flashes on the screen.

A number of user studies have proven that this causes users to perceive things
taking longer than they really have. If you don't show anything, users perceive
it as being faster.

So your loading component will also get a [`pastDelay` prop](#propspastdelay)
which will only be true once the component has taken longer to load than a set
[delay](#optsdelay).

```js
function Loading(props) {
  if (props.error) {
    return <div>Error!</div>;
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}
```

This delay defaults to `200ms` but you can also customize the
[delay](#optsdelay) in `Loadable`.

```js
Loadable({
  loader: () => import('./components/Bar'),
  loading: Loading,
  delay: 300, // 0.3 seconds
});
```

#### Timing out when the `loader` is taking too long

Sometimes network connections suck and never resolve or fail, they just hang
there forever. This sucks for the user because they won't know if it should
always take this long, or if they should try refreshing.

The [loading component](#loadingcomponent) will receive a
[`timedOut` prop](#propstimedout) which will be set to `true` when the
[`loader`](#optsloader) has timed out.

```js
function Loading(props) {
  if (props.error) {
    return <div>Error!</div>;
  } else if (props.timedOut) {
    return <div>Taking a long time...</div>;
  } else if (props.pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}
```

However, this feature is disabled by default. To turn it on, you can pass a
[`timeout` option](#optstimeout) to `Loadable`.

```js
Loadable({
  loader: () => import('./components/Bar'),
  loading: Loading,
  timeout: 10000, // 10 seconds
});
```

### Customizing rendering

By default `Loadable` will render the `default` export of the returned module.
If you want to customize this behavior you can use the
[`render` option](#optsrender).

```js
Loadable({
  loader: () => import('./my-component'),
  render(loaded, props) {
    let Component = loaded.namedExport;
    return <Component {...props}/>;
  }
});
```

### Loading multiple resources

Technically you can do whatever you want within `loader()` as long as it
returns a promise and [you're able to render something](#customizing-rendering).
But writing it out can be a bit annoying.

To make it easier to load multiple resources in parallel, you can use
[`LoadableMap`](#loadablemap).

```js
LoadableMap({
  loader: {
    Bar: () => import('./Bar'),
    i18n: () => fetch('./i18n/bar.json').then(res => res.json()),
  },
  render(loaded, props) {
    let Bar = loaded.Bar.default;
    let i18n = loaded.i18n;
    return <Bar {...props} i18n={i18n}/>;
  },
});
```

When using `LoadableMap` the [`render()` method](#optsrender) is required. It
will be passed a `loaded` param which will be an object matching the shape of
your `loader`.

### Preloading

As an optimization, you can also decide to preload a component before it gets
rendered.

For example, if you need to load a new component when a button gets pressed,
you could start preloading the component when the user hovers over the button.

The component created by `Loadable` exposes a
[static `preload` method](#loadablecomponentpreload) which does exactly this.

```js
const LoadableBar = Loadable({
  loader: () => import('./Bar'),
  loading: Loading,
});

class MyComponent extends React.Component {
  state = { showBar: false };

  onClick = () => {
    this.setState({ showBar: true });
  };

  onMouseOver = () => {
    LoadableBar.preload();
  };

  render() {
    return (
      <div>
        <button
          onClick={this.onClick}
          onMouseOver={this.onMouseOver}>
          Show Bar
        </button>
        {this.state.showBar && <LoadableBar/>}
      </div>
    )
  }
}
```

<h2>
  <hr>
  <hr>
  <img src="http://thejameskyle.com/img/react-loadable-ssr.png" alt="SERVER SIDE RENDERING">
  <hr>
  <hr>
  <small>Server-Side Rendering</small>
</h2>

When you go to render all these dynamically loaded components, what you'll get
is a whole bunch of loading screens.

This really sucks, but the good news is that React Loadable is designed to
make server-side rendering work as if nothing is being loaded dynamically.

Here's our starting server-rendering using [Meteor](https://meteor.com/).

```js
import React from 'react'
import { renderToString } from 'react-dom/server'
import { onPageLoad } from 'meteor/server-render'
import App from '/imports/App'

onPageLoad(sink => {
  sink.renderIntoElementById('root', renderToString(<App />)
})
```

### Preloading all your loadable components on the server

The first step to rendering the correct content from the server is to make sure
that all of your loadable components are already loaded when you go to render
them.

To do this, you can use the [`preloadLoadables`](#preloadloadables)
method. It returns a promise that will resolve when all your loadable
components are ready.

```js
preloadLoadables().then(() => {
  onPageLoad(sink => {
    sink.renderIntoElementById('root', renderToString(<App />)
  })
});
```

### Picking up a server-side rendered app on the client

This is where things get a little bit tricky. So let's prepare ourselves
little bit.

In order for us to pick up what was rendered from the server we need to have
all the same code that was used to render on the server.

To do this, we first need our loadable components telling us which modules they
are rendering.

#### Declaring which modules are being loaded

There is one option in [`Loadable`](#loadable) and
[`LoadableMap`](#loadablemap) which is used to tell us which modules our
component is trying to load: [`opts.meteor`](#optsmeteor).

```js
Loadable({
  loader: () => import('./Bar'),
  meteor: () => [require.resolve('./Bar')]
});
```

But don't worry too much about this option. React Loadable includes a
[Babel plugin](#babel-plugin) to add it for you.

Install the npdev version of the react-loadable babel plugin from npm:

```
$ meteor npm i -D npdev-react-loadable-babel
```

And add the `npdev-react-loadable-babel` plugin to your Babel config:

```json
{
  "plugins": [
    "npdev-react-loadable-babel"
  ]
}
```

Now this option will automatically be provided.

#### Finding out which dynamic modules were rendered

Next we need to find out which modules were actually rendered when a request
comes in.

For this, there is [`LoadableCaptureProvider`](#loadablecaptureprovider) component which can
be used to collect all the modules that were rendered.

```js
import { LoadableCaptureProvider, preloadAllLoadables } from 'meteor/npdev:react-loadable'

preloadAllLoadables().then(() => {
  onPageLoad(sink => {
    const loadableHandle = {};

    const html = ReactDOMServer.renderToString(
      <LoadableCaptureProvider handle={loadableHandle}>
        <App/>
      </LoadableCaptureProvider>
    );
    sink.renderIntoElementById('root', renderToString(app))

    console.log(modules);

    sink.appendToBody(loadableHandle.toScriptTag())
  })
});
```

#### Preloading ready loadable components on the client

We can use the [`preloadLoadables()`](#preloadLoadables) method on the
client to preload the loadable components that were included on the page.

Like [`preloadAllLoadables()`](#preloadAllLoadables) on the server, it returns
a promise, which on resolution means that we can hydrate our app.

```js
// src/entry.js
import React from 'react';
import ReactDOM from 'react-dom';
import { preloadLoadables } from 'meteor/npdev:react-loadable'
import App from './components/App';

preloadLoadables().then(() => {
  ReactDOM.hydrate(<App/>, document.getElementById('app'));
});

```

<h4 align="center">
  Now server-side rendering should work perfectly!
</h4>

<h2>
  <hr>
  <hr>
  <img src="http://thejameskyle.com/img/react-loadable-api-docs.png" alt="API DOCS">
  <hr>
  <hr>
  <small>API Docs</small>
</h2>

### `Loadable`

A higher-order component for dynamically [loading](#optsloader) a module before
[rendering](#optsrender) it, a [loading](#opts.loading) component is rendered
while the module is unavailable.

```js
const LoadableComponent = Loadable({
  loader: () => import('./Bar'),
  loading: Loading,
  delay: 200,
  timeout: 10000,
});
```

This returns a [LoadableComponent](#loadablecomponent).

### `LoadableMap`

A higher-order component that allows you to load multiple resources in parallel.

LoadableMap's [`opts.loader`](#optsloader) accepts an object of functions, and
needs a [`opts.render`](#optsrender) method.

```js
LoadableMap({
  loader: {
    Bar: () => import('./Bar'),
    i18n: () => fetch('./i18n/bar.json').then(res => res.json()),
  },
  render(loaded, props) {
    let Bar = loaded.Bar.default;
    let i18n = loaded.i18n;
    return <Bar {...props} i18n={i18n}/>;
  }
});
```

When using `LoadableMap` the `render()` method's `loaded` param will be an
object with the same shape as your `loader`. Note: A reference to `LoadableMap`
is available on `Loadable.Map` for backward compatibility and easy porting.

### `Loadable` and `LoadableMap` Options

#### `opts.loader`

A function returning a promise that loads your module.

```js
Loadable({
  loader: () => import('./Bar'),
});
```

When using with [`LoadableMap`](#loadablemap) this accepts an object of these
types of functions.

```js
LoadableMap({
  loader: {
    Bar: () => import('./Bar'),
    i18n: () => fetch('./i18n/bar.json').then(res => res.json()),
  },
});
```

When using with `LoadableMap` you'll also need to pass a
[`opts.render`](#optsrender) function.

#### `opts.loading`

A [`LoadingComponent`](#loadingcomponent) that renders while a module is
loading or when it errors.

```js
Loadable({
  loading: LoadingComponent,
});
```

This option is required, if you don't want to render anything, return `null`.

```js
Loadable({
  loading: () => null,
});
```

#### `opts.delay`

Time to wait (in milliseconds) before passing
[`props.pastDelay`](#propspastdelay) to your [`loading`](#optsloading)
component. This defaults to `200`.

```js
Loadable({
  delay: 200
});
```

[Read more about delays](#avoiding-flash-of-loading-component).

#### `opts.timeout`

Time to wait (in milliseconds) before passing
[`props.timedOut`](#propstimedout) to your [`loading`](#optsloading) component.
This is turned off by default.

```js
Loadable({
  timeout: 10000
});
```

[Read more about timeouts](#timing-out-when-the-loader-is-taking-too-long).

#### `opts.render`

A function to customize the rendering of loaded modules.

Receives `loaded` which is the resolved value of [`opts.loader`](#optsloader)
and `props` which are the props passed to the
[`LoadableComponent`](#loadablecomponent).

```js
Loadable({
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props}/>;
  }
});
```

#### `opts.meteor`

An optional function which returns an array of meteor module ids which you can
get with `require.resolve`.

```js
Loadable({
  loader: () => import('./Foo'),
  meteor: () => [require.resolve('./Foo')],
});
```

This option can be automated with the [Babel Plugin](#babel-plugin).

### `LoadableComponent`

This is the component returned by `Loadable` and `LoadableMap`.

```js
const LoadableComponent = Loadable({
  // ...
});
```

Props passed to this component will be passed straight through to the
dynamically loaded component via [`opts.render`](#optsrender).

#### `LoadableComponent.preload()`

This is a static method on [`LoadableComponent`](#loadablecomponent) which can
be used to load the component ahead of time.

```js
const LoadableComponent = Loadable({...});

LoadableComponent.preload();
```

This returns a promise, but you should avoid waiting for that promise to
resolve to update your UI. In most cases it creates a bad user experience.

[Read more about preloading](#preloading).

### `LoadingComponent`

This is the component you pass to [`opts.loading`](#optsloading).

```js
function LoadingComponent(props) {
  if (props.error) {
    // When the loader has errored
    return <div>Error!</div>;
  } else if (props.timedOut) {
    // When the loader has taken longer than the timeout
    return <div>Taking a long time...</div>;
  } else if (props.pastDelay) {
    // When the loader has taken longer than the delay
    return <div>Loading...</div>;
  } else {
    // When the loader has just started
    return null;
  }
}

Loadable({
  loading: LoadingComponent,
});
```

[Read more about loading components](#creating-a-great-loading-component)

#### `props.error`

An `Error` object passed to [`LoadingComponent`](#loadingcomponent) when the
[`loader`](#optsloader) has failed. When there is no error, `null` is
passed.

```js
function LoadingComponent(props) {
  if (props.error) {
    return <div>Error!</div>;
  } else {
    return <div>Loading...</div>;
  }
}
```

[Read more about errors](#loading-error-states).

#### `props.timedOut`

A boolean prop passed to [`LoadingComponent`](#loadingcomponent) after a set
[`timeout`](#optstimeout).

```js
function LoadingComponent(props) {
  if (props.timedOut) {
    return <div>Taking a long time...</div>;
  } else {
    return <div>Loading...</div>;
  }
}
```

[Read more about timeouts](#timing-out-when-the-loader-is-taking-too-long).

#### `props.pastDelay`

A boolean prop passed to [`LoadingComponent`](#loadingcomponent) after a set
[`delay`](#optsdelay).

```js
function LoadingComponent(props) {
  if (props.pastDelay) {
    return <div>Loading...</div>;
  } else {
    return null;
  }
}
```

[Read more about delays](#avoiding-flash-of-loading-component).

### `preloadAllLoadables()`

This will call all of the
[`LoadableComponent.preload`](#loadablecomponentpreload) methods recursively
until they are all resolved. Allowing you to preload all of your dynamic
modules in environments like the server.

```js
import { preloadAllLoadables } from 'meteor/npdev:react-loadable'

preloadAllLoadables().then(() => onPageLoad(sink => {
  // do server rendering
});
```

It's important to note that this requires that you declare all of your loadable
components when modules are initialized rather than when your app is being
rendered.

**Good:**

```js
// During module initialization...
const LoadableComponent = Loadable({...});

class MyComponent extends React.Component {
  componentDidMount() {
    // ...
  }
}
```

**Bad:**

```js
// ...

class MyComponent extends React.Component {
  componentDidMount() {
    // During app render...
    const LoadableComponent = Loadable({...});
  }
}
```

> **Note:** `preloadLoadables()` will not work if you have more than one
> copy of `react-loadable` in your app.

[Read more about preloading on the server](#preloading-all-your-loadable-components-on-the-server).

### `preloadLoadables()`

Check for modules that hav been rendered on the server and call the matching
[`LoadableComponent.preload`](#loadablecomponentpreload) methods.

```js
preloadLoadables().then(() => {
  ReactDOM.hydrate(<App/>, document.getElementById('app'));
});
```

[Read more about preloading on the client](#waiting-to-render-on-the-client-until-all-the-bundles-are-loaded).

### `LoadableCaptureProvider`

A component for recording which modules were rendered in SSR.

Accepts a `handle` prop, and object which is extended with a list of
resolved module ids, and helpful methods; `toEJON` and `toScriptTag`.

```js
import { LoadableCaptureProvider, preloadLoadables } from 'meteor/npdev:react-loadable'

preloadLoadables().then(() => onPageLoad(sink => {
  const loadableHandle = {};

  const html = ReactDOMServer.renderToString(
    <LoadableCaptureProvider handle={loadableHandle}>
      <App/>
    </LoadableCaptureProvider>
  );
  sink.renderIntoElementById('root', html)

  console.log(loadableHandle);

  sink.appendToBody(loadableHandle.toScriptTag());
}));
```

[Read more about capturing rendered modules](#finding-out-which-dynamic-modules-were-rendered).

## Babel Plugin

Providing [`opts.meteor`](#optsmeteor) for
every loadable component is a lot of manual work to remember to do.

Instead you can install the babel plugin from npm, and add the
Babel plugin to your config and it will automate it for you:

```
$ meteor npm i -D npdev-react-loadable-babel
```

```json
{
  "plugins": ["npdev-react-loadable-babel"]
}
```

**Input**

```js
import { Loadable, LoadableMap } from 'meteor/npdev:react-loadable';

const LoadableMyComponent = Loadable({
  loader: () => import('./MyComponent'),
});

const LoadableComponents = LoadableMap({
  loader: {
    One: () => import('./One'),
    Two: () => import('./Two'),
  },
});
```

**Output**

```js
import { Loadable, LoadableMap } from 'meteor/npdev:react-loadable';
import path from 'path';

const LoadableMyComponent = Loadable({
  loader: () => import('./MyComponent'),
  meteor: () => [require.resolve('./MyComponent')]
});

const LoadableComponents = LoadableMap({
  loader: {
    One: () => import('./One'),
    Two: () => import('./Two'),
  },
  meteor: () => [require.resolve('./One'), require.resolve('./Two')]
});
```

[Read more about declaring modules](#declaring-which-modules-are-being-loaded).

### How do I avoid repetition?

Specifying the same `loading` component or `delay` every time you use
`Loadable()` gets repetitive fast. Instead you can wrap `Loadable` with your
own Higher-Order Component (HOC) to set default options.

```js
import { Loadable } from 'meteor/npdev:react-loadable';
import Loading from './my-loading-component';

export default function MyLoadable(opts) {
  return Loadable(Object.assign({
    loading: Loading,
    delay: 200,
    timeout: 10000,
  }, opts));
};
```

Then you can just specify a `loader` when you go to use it.

```js
import MyLoadable from './MyLoadable';

const LoadableMyComponent = MyLoadable({
  loader: () => import('./MyComponent'),
});

export default class App extends React.Component {
  render() {
    return <LoadableMyComponent/>;
  }
}
```

Unfortunately at the moment using wrapped Loadable breaks [npdev-react-loadable-babel](#babel-plugin) so in such case you have to add required property (`meteor`) manually.

```js
import MyLoadable from './MyLoadable';

const LoadableMyComponent = MyLoadable({
  loader: () => import('./MyComponent'),
  meteor: () => [require.resolve('./MyComponent')]
});

export default class App extends React.Component {
  render() {
    return <LoadableMyComponent/>;
  }
}
```
