import React from 'react'

export function load (loader) {
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

export function loadMap (obj) {
  const state = {
    loading: false,
    loaded: {},
    error: null
  }

  const promises = []

  try {
    Object.keys(obj).forEach(key => {
      const result = load(obj[key])

      if (!result.loading) {
        state.loaded[key] = result.loaded
        state.error = result.error
      } else {
        state.loading = true
      }

      promises.push(result.promise)

      result.promise
        .then(res => {
          state.loaded[key] = res
        })
        .catch(err => {
          state.error = err
        })
    })
  } catch (err) {
    state.error = err
  }

  state.promise = Promise.all(promises)
    .then(res => {
      state.loading = false
      return res
    })
    .catch(err => {
      state.loading = false
      throw err
    })

  return state
}

function resolve (obj) {
  return obj && obj.__esModule ? obj.default : obj
}

export function resolveRender (loaded, props) {
  return React.createElement(resolve(loaded), props)
}

export function flushInitializers (initializers) {
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
