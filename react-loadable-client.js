import { EJSON } from 'meteor/ejson'
import React, { useState, useEffect, useReducer } from 'react'

const INITIALIZERS = []
const INITIALIZERS_BY_MODULE = {}

function load (loader) {
  const promise = loader()

  const state = {
    loading: true,
    loaded: null,
    error: null
  }

  state.promise = promise
    .then(loaded => {
      state.loading = false
      state.loaded = loaded
      return loaded
    })
    .catch(err => {
      state.loading = false
      state.error = err
      throw err
    })

  return state
}

function resolve (obj) {
  return obj && obj.__esModule ? obj.default : obj
}

function resolveRender (loaded, props) {
  return React.createElement(resolve(loaded), props)
}

// Used to create a forceUpdate from useReducer. Forces update by
// incrementing a number whenever the dispatch method is invoked.
const fur = x => x + 1

/**
 * Creates a "Loadable" component at startup, which will persist for the length of the program.
 */
export const Loadable = ({ render = resolveRender, meteor, loader, loading, delay = 200, timeout = null }) => {
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
      return React.createElement(loading, {
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

function flushInitializers (initializers) {
  const promises = []

  while (initializers.length) {
    const init = initializers.pop()
    promises.push(init())
  }

  return Promise.all(promises).then(() => {
    if (initializers.length) {
      return flushInitializers(initializers)
    }
  })
}

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
    return preload(preloadables)
  } else {
    return new Promise((resolve) => { resolve() })
  }
}
