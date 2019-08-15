import { EJSON } from 'meteor/ejson'
import React, { useState, useEffect, useRef } from 'react'

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

/**
 * Creates a "Loadable" component at startup, which will persist for the length of the program.
 */
export const Loadable = ({ render = resolveRender, meteor, loader, loading, delay = 200, timeout = null }) => {
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
  if (typeof meteor === 'function') {
    INITIALIZERS_BY_MODULE[meteor().sort().join(',')] = () => {
      return init()
    }
  }

  function Loadable (props) {
    if (!res || !res.loaded) init()

    const [pastDelay, setPastDelay] = useState(false)
    const [timedOut, setTimedOut] = useState(false)
    const [status, setStatus] = useState({
      inError: res.error,
      isLoading: res.loading,
      loaded: res.loaded
    })
    const { current: refs } = useRef({})

    const _clearTimeouts = () => {
      clearTimeout(refs._delay)
      clearTimeout(refs._timeout)
    }

    useEffect(() => {
      if (!status.isLoading) {
        return
      }

      if (typeof delay === 'number') {
        if (delay === 0) {
          setPastDelay(true)
        } else {
          refs._delay = setTimeout(() => {
            setPastDelay(true)
          }, delay)
        }
      }

      if (typeof timeout === 'number') {
        refs._timeout = setTimeout(() => {
          setTimedOut(true)
        }, timeout)
      }

      const update = () => {
        setStatus({
          error: res.error,
          loaded: res.loaded,
          loading: res.loading
        })

        _clearTimeouts()
      }

      res.promise
        .then(() => {
          update()
        })
        .catch(err => {
          console.error(err)
          update()
        })

      return () => {
        _clearTimeouts()
      }
    }, [])

    // render
    if (status.isLoading || status.error) {
      return React.createElement(loading, {
        isLoading: status.isLoading,
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
