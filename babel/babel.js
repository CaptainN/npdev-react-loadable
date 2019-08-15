'use strict'
exports.__esModule = true
exports.default = function ({ types: t }) {
  return {
    visitor: {
      ImportDeclaration (path) {
        var source = path.node.source.value
        if (source !== 'meteor/npdev:react-loadable') return

        var specifier = path.get('specifiers').find(specifier => {
          return (specifier.parent.source.value === 'meteor/npdev:react-loadable' &&
            specifier.node.local.name === 'Loadable')
        })

        if (!specifier) return

        var bindingName = specifier.node.local.name
        var binding = path.scope.getBinding(bindingName)

        binding.referencePaths.forEach(refPath => {
          var callExpression = refPath.parentPath

          if (
            callExpression.isMemberExpression() &&
            callExpression.node.computed === false &&
            callExpression.get('property').isIdentifier({ name: 'Map' })
          ) {
            callExpression = callExpression.parentPath
          }

          if (!callExpression.isCallExpression()) return

          var args = callExpression.get('arguments')
          if (args.length !== 1) throw callExpression.error

          var options = args[0]
          if (!options.isObjectExpression()) return

          var properties = options.get('properties')
          var propertiesMap = {}

          properties.forEach(property => {
            var key = property.get('key')
            propertiesMap[key.node.name] = property
          })

          if (propertiesMap.meteor) {
            return
          }

          var loaderMethod = propertiesMap.loader.get('value')
          var dynamicImports = []

          loaderMethod.traverse({
            Import (path) {
              dynamicImports.push(path.parentPath)
            }
          })

          if (!dynamicImports.length) return

          propertiesMap.loader.insertAfter(
            t.objectProperty(
              t.identifier('meteor'),
              t.arrowFunctionExpression(
                [],
                t.arrayExpression(
                  dynamicImports.map(dynamicImport => {
                    return t.callExpression(
                      t.memberExpression(
                        t.identifier('require'),
                        t.identifier('resolve')
                      ),
                      [dynamicImport.get('arguments')[0].node]
                    )
                  })
                )
              )
            )
          )
        })
      }
    }
  }
}
