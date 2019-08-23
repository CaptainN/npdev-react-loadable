/* global Tinytest */
import React from 'react'
import { create, act } from 'react-test-renderer'
import snapshots from './tests.snap.js'
import prettyFormat from 'pretty-format'

const pretty = (component) => '\n' + prettyFormat(component.toJSON(), {
  plugins: [prettyFormat.plugins.ReactTestComponent],
  printFunctionName: false
}) + '\n'

function waitFor (delay) {
  return new Promise(resolve => {
    setTimeout(resolve, delay)
  })
}

function createLoader (delay, loader, error) {
  return () => {
    return waitFor(delay).then(() => {
      if (loader) {
        return loader()
      } else {
        throw error
      }
    })
  }
}

function MyLoadingComponent (props) {
  return <div>MyLoadingComponent {JSON.stringify(props)}</div>
}

function MyComponent (props) {
  return <div>MyComponent {JSON.stringify(props)}</div>
}

// afterEach(async () => {
//   try {
//     await Loadable.preloadAll()
//   } catch (err) {}
// })

Tinytest.addAsync('loading success', async (test) => {
  import { Loadable } from './react-loadable-client'

  const LoadableMyComponent = Loadable({
    loader: createLoader(400, () => MyComponent),
    loading: MyLoadingComponent
  })

  let component1
  act(() => {
    component1 = create(<LoadableMyComponent prop="foo" />)
  })

  test.equal(pretty(component1), snapshots['loading success 1']) // initial
  await waitFor(200)
  test.equal(pretty(component1), snapshots['loading success 2']) // loading
  await waitFor(200)
  test.equal(pretty(component1), snapshots['loading success 3']) // loaded

  let component2
  act(() => {
    component2 = create(<LoadableMyComponent prop="bar" />)
  })

  test.equal(pretty(component2), snapshots['loading success 4']) // reload
})

Tinytest.addAsync('delay and timeout', async (test) => {
  import { Loadable } from './react-loadable-client'

  const LoadableMyComponent = Loadable({
    loader: createLoader(300, () => MyComponent),
    loading: MyLoadingComponent,
    delay: 100,
    timeout: 200
  })

  let component1
  act(() => {
    component1 = create(<LoadableMyComponent prop="foo" />)
  })

  test.equal(pretty(component1), snapshots['delay and timeout 1']) // initial
  await waitFor(100)
  test.equal(pretty(component1), snapshots['delay and timeout 2']) // loading
  await waitFor(100)
  test.equal(pretty(component1), snapshots['delay and timeout 3']) // timed out
  await waitFor(100)
  test.equal(pretty(component1), snapshots['delay and timeout 4']) // loaded
})

Tinytest.addAsync('loading error', async (test) => {
  import { Loadable } from './react-loadable-client'

  const LoadableMyComponent = Loadable({
    loader: createLoader(400, null, new Error('test error')),
    loading: MyLoadingComponent
  })

  let component
  act(() => {
    component = create(<LoadableMyComponent prop="baz" />)
  })

  test.equal(pretty(component), snapshots['loading error 1']) // initial
  await waitFor(200)
  test.equal(pretty(component), snapshots['loading error 2']) // loading
  await waitFor(200)
  test.equal(pretty(component), snapshots['loading error 3']) // errored
})

// Tinytest.addAsync('server side rendering', async (test) => {
//   import { Loadable } from './react-loadable-client'

//   let LoadableMyComponent = Loadable({
//     loader: createLoader(400, () => require('../__fixtures__/component')),
//     loading: MyLoadingComponent,
//   })

//   await Loadable.preloadAll()

//   let component = create(<LoadableMyComponent prop="baz" />)

//   expect(component.toJSON()).toMatchSnapshot() // serverside
// })

// Tinytest.addAsync('server side rendering es6', async (test) => {
//   import { Loadable } from './react-loadable-client'

//   let LoadableMyComponent = Loadable({
//     loader: createLoader(400, () => require('../__fixtures__/component.es6')),
//     loading: MyLoadingComponent,
//   })

//   await Loadable.preloadAll()

//   let component = create(<LoadableMyComponent prop="baz" />)

//   expect(component.toJSON()).toMatchSnapshot() // serverside
// })

Tinytest.addAsync('preload', async (test) => {
  import { Loadable } from './react-loadable-client'

  const LoadableMyComponent = Loadable({
    loader: createLoader(400, () => MyComponent),
    loading: MyLoadingComponent
  })

  const promise = LoadableMyComponent.preload()
  await waitFor(200)

  let component1
  act(() => {
    component1 = create(<LoadableMyComponent prop="baz" />)
  })

  test.equal(pretty(component1), snapshots['preload 1']) // still loading...
  await promise
  test.equal(pretty(component1), snapshots['preload 2']) // success

  let component2
  act(() => {
    component2 = create(<LoadableMyComponent prop="baz" />)
  })
  test.equal(pretty(component2), snapshots['preload 3']) // success
})

Tinytest.addAsync('render', async (test) => {
  import { Loadable } from './react-loadable-client'

  const LoadableMyComponent = Loadable({
    loader: createLoader(400, () => ({ MyComponent })),
    loading: MyLoadingComponent,
    render (loaded, props) {
      return <loaded.MyComponent {...props} />
    }
  })
  let component
  act(() => {
    component = create(<LoadableMyComponent prop="baz" />)
  })
  test.equal(pretty(component), snapshots['render 1']) // initial
  await waitFor(200)
  test.equal(pretty(component), snapshots['render 2']) // loading
  await waitFor(200)
  test.equal(pretty(component), snapshots['render 3']) // success
})

Tinytest.addAsync('loadable map success', async (test) => {
  import { Loadable } from './react-loadable-client'

  const LoadableMyComponent = Loadable.Map({
    loader: {
      a: createLoader(200, () => ({ MyComponent })),
      b: createLoader(400, () => ({ MyComponent }))
    },
    loading: MyLoadingComponent,
    render (loaded, props) {
      return (
        <div>
          <loaded.a.MyComponent {...props} />
          <loaded.b.MyComponent {...props} />
        </div>
      )
    }
  })

  let component
  act(() => {
    component = create(<LoadableMyComponent prop="baz" />)
  })
  test.equal(pretty(component), snapshots['loadable map success 1']) // initial
  await waitFor(200)
  test.equal(pretty(component), snapshots['loadable map success 2']) // loading
  await waitFor(200)
  test.equal(pretty(component), snapshots['loadable map success 3']) // success
})

Tinytest.addAsync('loadable map error', async (test) => {
  import { Loadable } from './react-loadable-client'

  const LoadableMyComponent = Loadable.Map({
    loader: {
      a: createLoader(200, () => ({ MyComponent })),
      b: createLoader(400, null, new Error('test error'))
    },
    loading: MyLoadingComponent,
    render (loaded, props) {
      return (
        <div>
          <loaded.a.MyComponent {...props} />
          <loaded.b.MyComponent {...props} />
        </div>
      )
    }
  })

  let component
  act(() => {
    component = create(<LoadableMyComponent prop="baz" />)
  })
  test.equal(pretty(component), snapshots['loadable map error 1']) // initial
  await waitFor(200)
  test.equal(pretty(component), snapshots['loadable map error 2']) // loading
  await waitFor(200)
  test.equal(pretty(component), snapshots['loadable map error 3']) // success
})

// describe('preloadReady', () => {
//   beforeEach(() => {
//     global.__webpack_modules__ = { 1: true, 2: true }
//   })

//   afterEach(() => {
//     delete global.__webpack_modules__
//   })

//   test('undefined', async () => {
//     let LoadableMyComponent = Loadable({
//       loader: createLoader(200, () => MyComponent),
//       loading: MyLoadingComponent,
//     })

//     await Loadable.preloadReady()

//     let component = create(<LoadableMyComponent prop="baz" />)

//     expect(component.toJSON()).toMatchSnapshot()
//   })

//   test('one', async () => {
//     let LoadableMyComponent = Loadable({
//       loader: createLoader(200, () => MyComponent),
//       loading: MyLoadingComponent,
//       webpack: () => [1],
//     })

//     await Loadable.preloadReady()

//     let component = create(<LoadableMyComponent prop="baz" />)

//     expect(component.toJSON()).toMatchSnapshot()
//   })

//   test('many', async () => {
//     let LoadableMyComponent = Loadable({
//       loader: createLoader(200, () => MyComponent),
//       loading: MyLoadingComponent,
//       webpack: () => [1, 2],
//     })

//     await Loadable.preloadReady()

//     let component = create(<LoadableMyComponent prop="baz" />)

//     expect(component.toJSON()).toMatchSnapshot()
//   })

//   test('missing', async () => {
//     let LoadableMyComponent = Loadable({
//       loader: createLoader(200, () => MyComponent),
//       loading: MyLoadingComponent,
//       webpack: () => [1, 42],
//     })

//     await Loadable.preloadReady()

//     let component = create(<LoadableMyComponent prop="baz" />)

//     expect(component.toJSON()).toMatchSnapshot()
//   })

//   test('delay with 0', () => {
//     let LoadableMyComponent = Loadable({
//       loader: createLoader(300, () => MyComponent),
//       loading: MyLoadingComponent,
//       delay: 0,
//       timeout: 200,
//     })

//     let loadingComponent = create(<LoadableMyComponent prop="foo" />)

//     expect(loadingComponent.toJSON()).toMatchSnapshot() // loading
//   })
// })
