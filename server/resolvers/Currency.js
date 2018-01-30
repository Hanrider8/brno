import Currency from '../models/Currency'
import GraphQLJSON from 'graphql-type-json';

export default {
  JSON: GraphQLJSON,
  Query: {
    topCurrency: async () => {
      try {
        return {
          currency: await Currency.find().sort({requests: 'desc'}),
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
        const convertedAmountinUSD = amount * cache[cur]
        if (!currency) {
          currency = await Currency.create({
            name: destCur,
            converted: convertedAmountinUSD,
            requests: 1,
          })
        } else {
          currency.converted = currency.converted + convertedAmountinUSD
          currency.requests = currency.requests + 1
          currency.save()
        }
        return {
          convertedAmountDest: convertedAmountinUSD * cache[destCur],
          convertedAmountinUSD,
          currency,
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
