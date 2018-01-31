import express from 'express'
import bodyParser from 'body-parser'
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express'
import { makeExecutableSchema } from 'graphql-tools'
import path from 'path'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas'
import cors from 'cors'
import mongoose from 'mongoose'
import fetch from 'node-fetch'
import { createServer } from 'http'
import config from './config'

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')))
const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, './resolvers'))
)
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
})

const staticFiles = express.static(path.join(__dirname, '../../client/build'))
const isNotProduction = process.env.NODE_ENV !== 'production'

mongoose.connect(config.MONGO_URL)
mongoose.Promise = global.Promise

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.once(
  'openUri',
  console.log.bind(console, `Database connected to ${config.MONGO_URL}`)
)

const app = express()

if (isNotProduction) {
  app.use('*', cors('*'))
}

let currency = {}

const currencyReq = async (req, res, next) => {
  if (
    currency &&
    currency.timestamp < Date.now() + config.FETCH_INTERVAL_IN_SECONDS * 1000
  ) {
    req.currency = currency
  } else {
    await fetch(`https://${config.API_URL}?app_id=${config.API_KEY}`)
      .then(res => res.json())
      .then(json => {
        req.currency = json
        currency = json
      })
  }
  if (!isNotProduction && req.headers['x-forwarded-proto'] !== 'https')
    res.redirect(`https://${req.headers['host']}${req.url}`)
  else next()
}

app.use(currencyReq)

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: config.ENDPOINT_URL,
  })
)

app.use(
  config.ENDPOINT_URL,
  bodyParser.json(),
  graphqlExpress(req => ({
    schema,
    context: {
      cache: req.currency.rates,
    },
  }))
)

app.use(staticFiles)
app.use('*', staticFiles)

const server = createServer(app)

server.listen(config.PORT)
