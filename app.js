const Fastify = require('fastify')
const path = require('path')
const AutoLoad = require('fastify-autoload')
const config = require('config')
const jwt = require('fastify-jwt')
const cors = require('fastify-cors')
const formBody = require('fastify-formbody')

const build = (opts = {}) => {
  const app = Fastify(opts)

  app.register(formBody)

  app.register(jwt, {
    secret: config.get('secrets.jwt')
  })

  app.register(AutoLoad, {
    dir: path.join(__dirname, 'routes')
  })

  app.register(cors, {
    origin: true
  })

  // app.decorate('authenticate', async function (request) {
  //   await request.jwtVerify()
  //   if (request.user.role !== userRoles.AGENT) {
  //     throw new ApiError(NO_AUTHORIZATION)
  //   }
  // })

  app.addHook('preHandler', function (req, reply, done) {
    if (req.method !== 'GET') {
      req.log.info({ body: req.body }, `${req.url} request`)
    }
    done()
  })

  app.setErrorHandler(function (error, request, reply) {
    let errorResponse
    if (error.name === 'ApiError') {
      reply = reply.code(400)
      errorResponse = { ...error, message: error.message }
    } else if (typeof error === 'string' || error instanceof String) {
      errorResponse = new Error(error)
    } else {
      errorResponse = error
    }
    app.log.error(errorResponse)
    reply.send(errorResponse)
  })

  return app
}

module.exports = build
