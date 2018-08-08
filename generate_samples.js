const Swagger = require('swagger-client')
const jsYaml = require('@kyleshockey/js-yaml')
const fs = require('fs')

const spec = jsYaml.safeLoad(fs.readFileSync("./spec.yaml"))

// Rotated often! For demo use only! Get a free key here:
// https://p.nomics.com/cryptocurrency-bitcoin-api/
const key = "6eb4ce24acd11f0840e931f8e1158e1c"

Swagger({spec}).then((jx) => {
  Object.keys(jx.spec.paths).forEach((k) => {
    const path = jx.spec.paths[k]
    let params = [`key=${key}`]
    if (path.get && path.get.parameters) {
      path.get.parameters.forEach((p) => {
        if (p.name && p.example) {
          params.push(`${p.name}=${p.example}`)
        }
      })
    }
    const url = `${jx.spec.servers[0].url}${k}?${params.join("&")}`
    fs.writeFileSync(`./samples/${path.get.operationId}.json`, JSON.stringify([{
      lang: "URL",
      source: url,
    }]))
  })
})
