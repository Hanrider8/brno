import Currency from '../models/Currency'

export default {
  Query: {
    topCurrency: async (parent, args, { cache }) => {
      try {
        console.log('cache', cache)
        return {
          ok: true,
        }
      } catch (err) {
        return {
          ok: false,
          valErrors: [err],
        }
      }
    },
    currencyRate: async (parent, { cur }, { cache }) => {
      try {
        return {
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
        // const top = await Currency.find({name: destCur});
        // if(!top) {
        //     await Currency.create({name: destCur, converted: amount, request: 1});
        // }
        // pubsub.publish(WORKOUT_ADDED, {workoutAdded: workout});
        return {
          convertedAmount: 8,
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
