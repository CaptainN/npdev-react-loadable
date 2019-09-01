/* global Meteor */
import { EJSON } from 'meteor/ejson'
import { useState, useEffect, useReducer, createElement } from 'react'
import { load, loadMap, resolveRender, flushInitializers } from './react-loadable-both'

const INITIALIZERS = []
const INITIALIZERS_BY_MODULE = {}

// Used to create a forceUpdate from useReducer. Forces update by
// incrementing a number whenever the dispatch method is invoked.
const fur = x => x + 1

/**
 * Creates a "Loadable" component at startup, which will persist for the length of the program.
 */
const createLoadable = (load) => ({ render = resolveRender, meteor, loader, loading, delay = 200, timeout = null }) => {
  if (!loading) {
    throw new Error('react-loadable requires a `loading` component')
  }

  // Gets ready to load the module, and maintain status
  let status = null
  function init () {
    if (!status) {
      status = load(loader)
    }
    return status.promise
  }

  // Store all the INITIALIZERS for later use
  INITIALIZERS.push(init)
  if (typeof meteor === 'function') {
    INITIALIZERS_BY_MODULE[meteor().sort().join(',')] = () => {
      return init()
    }
  }

  function Loadable (props) {
    // We are starting load as early as possible. We are counting
    // on Meteor to avoid problems if this happens to get fired
    // off more than once in concurrent mode.
    if (!status) {
      init()
    }

    const [pastDelay, setPastDelay] = useState(delay === 0)
    const [timedOut, setTimedOut] = useState(false)
    const [, forceUpdate] = useReducer(fur, 0)

    const wasLoading = status.loading
    useEffect(() => {
      // If status.loading is false, then we either have an error
      // state, or have loaded successfully. In either case, we
      // don't need to set up any timeouts, or watch for updates.
      if (!status.loading) {
        // It's possible loading completed between render and commit.
        if (wasLoading) {
          forceUpdate()
        }
        return
      }

      // If we got this far, we need to set up the two timeouts
      let tidDelay
      let tidTimeout
      const _clearTimeouts = () => {
        if (tidDelay) clearTimeout(tidDelay)
        if (tidTimeout) clearTimeout(tidTimeout)
      }

      if (typeof delay === 'number' && delay > 0) {
        tidDelay = setTimeout(() => {
          setPastDelay(true)
        }, delay)
      }

      if (typeof timeout === 'number') {
        tidTimeout = setTimeout(() => {
          setTimedOut(true)
        }, timeout)
      }

      // Use to avoid updating state after unmount.
      let mounted = true

      const update = () => {
        _clearTimeouts()
        if (mounted) {
          forceUpdate()
        }
      }

      status.promise
        .then(() => {
          update()
        })
        .catch(err => {
          console.error(err)
          update()
        })

      return () => {
        mounted = false
        _clearTimeouts()
      }
    }, [])

    // render
    if (status.loading || status.error) {
      return createElement(loading, {
        isLoading: status.loading,
        pastDelay: pastDelay,
        timedOut: timedOut,
        error: status.error
      })
    } else if (status.loaded) {
      return render(status.loaded, props)
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

const preload = (preloadables) => {
  const initializers = preloadables.map(preloadable => {
    return INITIALIZERS_BY_MODULE[preloadable]
  })
  return flushInitializers(initializers)
}

export const preloadLoadables = (id = '__preloadables__') => {
  const preloadablesNode = document.getElementById(id)
  if (preloadablesNode) {
    const preloadables = EJSON.parse(preloadablesNode.innerText)
    preloadablesNode.parentNode.removeChild(preloadablesNode)
    return preload(preloadables)
  } else {
    return new Promise((resolve) => { resolve() })
  }
}
