/* global Meteor */
import { EJSON } from 'meteor/ejson'
import { useContext, createContext, createElement } from 'react'
import { load, loadMap, resolveRender, flushInitializers } from './react-loadable-both'

const INITIALIZERS = []

const LoadableContext = createContext(false)
export const LoadableCaptureProvider = ({ handle, children }) => {
  if (!handle.loadables) {
    handle.loadables = []
    handle.toEJSON = () => (
      EJSON.stringify(handle.loadables)
    )
    handle.toScriptTag = () => (
      `<script type="text/ejson" id="__preloadables__">${EJSON.stringify(handle.loadables)}</script>`
    )
  }
  return createElement(LoadableContext.Provider, { value: handle }, children)
}

/**
 * Creates a "Loadable" component at startup, which will persist for the length of the program.
 */
const createLoadable = (load) => (options) => {
  const { render = resolveRender, loader, meteor, loading } = options

  if (!loading) {
    throw new Error('react-loadable requires a `loading` component')
  }

  // Gets ready to load the module
  let res = null
  function init () {
    if (!res) {
      res = load(loader)
    }
    return res.promise
  }

  // Store all the INITIALIZERS for later use
  INITIALIZERS.push(init)

  const Loadable = (props) => {
    if (!res || !res.loaded) init()

    // record the path for use in client loading
    const capture = useContext(LoadableContext)
    if (capture && typeof meteor === 'function') {
      capture.loadables.push(meteor().sort().join(','))
    }

    // render
    if (res.loading || res.error) {
      return createElement(loading, {
        isLoading: res.loading,
        pastDelay: false,
        timedOut: false,
        error: res.error
      })
    } else if (res.loaded) {
      return render(res.loaded, props)
    } else {
      return null
    }
  }

  Loadable.preload = () => {
    return init()
  }

  return Loadable
}

export const Loadable = createLoadable(load)
export const LoadableMap = Meteor.isDevelopment
  ? (((LoadableMap) => (opts) => {
    if (typeof opts.render !== 'function') {
      throw new Error('LoadableMap requires a `render(loaded, props)` function')
    }
    return LoadableMap(opts)
  })(createLoadable(loadMap)))
  : createLoadable(loadMap)

// For backward compat and easy porting
Loadable.Map = LoadableMap

export const preloadAllLoadables = () => {
  return new Promise((resolve, reject) => {
    flushInitializers(INITIALIZERS).then(resolve, reject)
  })
}
