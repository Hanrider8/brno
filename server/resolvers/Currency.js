import GraphQLJSON from 'graphql-type-json';
import Currency from '../models/Currency';

const round = (value, spaces = 2) => Number(value.toFixed(spaces));

export default {
  JSON: GraphQLJSON,
  Query: {
    topCurrency: async (parent, { amount }) => {
      try {
        return {
          currency: amount
            ? await Currency.find()
              .limit(10)
              .sort({ converted: 'desc' })
            : await Currency.find()
              .limit(10)
              .sort({ requests: 'desc' }),
          ok: true,
        };
      } catch (err) {
        return {
          ok: false,
          valErrors: [err],
        };
      }
    },
    currencyRate: async (parent, args, { cache }) => {
      try {
        return {
          cache,
          ok: true,
        };
      } catch (err) {
        return {
          ok: false,
          valErrors: [err],
        };
      }
    },
  },
  Mutation: {
    convert: async (parent, { amount, cur, destCur }, { cache }) => {
      const roundSpaces = 4;
      try {
        if (!cache.hasOwnProperty(cur) || !cache.hasOwnProperty(destCur)) {
          throw 'Unknown currency!';
        }
        if (cur === destCur) {
          throw 'Both currency are the same!';
        }
        if (amount === 0 || amount < 0) {
          throw 'Amount is too low.';
        }
        if (Object.keys(cache).length === 0) {
          throw 'Currency data are not ready. Try again later.';
        }
        const currency = await Currency.findOne({ name: destCur });
        const convertedAmountinUSD = round(amount / cache[cur], roundSpaces);
        if (!currency) {
          await Currency.create({
            name: destCur,
            converted: convertedAmountinUSD,
            requests: 1,
          });
        } else {
          currency.converted = round(currency.converted + convertedAmountinUSD, roundSpaces);
          currency.requests += 1;
          currency.save();
        }
        return {
          convertedAmountDest: round(convertedAmountinUSD * cache[destCur], roundSpaces),
          convertedAmountinUSD,
          ok: true,
        };
      } catch (err) {
        return {
          ok: false,
          valErrors: [err],
        };
      }
    },
  },
};
