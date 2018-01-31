import Currency from '../models/Currency'
import GraphQLJSON from 'graphql-type-json'

const round = (value, spaces = 2) => Number(value.toFixed(spaces))

export default {
  JSON: GraphQLJSON,
  Query: {
    topCurrency: async (parent, {amount}) => {
      try {
        console.log('amount', amount)
        return {
          currency: amount ? await Currency.find().limit(10).sort({ converted: 'desc' }) : await Currency.find().limit(10).sort({ requests: 'desc' }),
          ok: true,
        }
      } catch (err) {
        return {
          ok: false,
          valErrors: [err],
        }
      }
    },
    currencyRate: async (parent, args, { cache }) => {
      try {
        return {
          cache,
          ok: true,
        }
      } catch (err) {
        return {
          ok: false,
          valErrors: [err],
        }
      }
    },
  },
  Mutation: {
    convert: async (parent, { amount, cur, destCur }, { cache }) => {
      try {
        let currency = await Currency.findOne({ name: destCur })
        let convertedAmountinUSD = round(amount / cache[cur], 4)
        if (!currency) {
          await Currency.create({
            name: destCur,
            converted: convertedAmountinUSD,
            requests: 1,
          })
        } else {
          currency.converted = round(currency.converted + convertedAmountinUSD, 4)
          currency.requests += 1
          currency.save()
        }
        return {
          convertedAmountDest: round(convertedAmountinUSD * cache[destCur], 4),
          convertedAmountinUSD,
          ok: true,
        }
      } catch (err) {
        return {
          ok: false,
          valErrors: [err],
        }
      }
    },
  },
}
