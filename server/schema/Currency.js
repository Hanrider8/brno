export default `
scalar JSON
  type Currency {
    _id: ID!
    name: String!
    converted: Float!
    requests: Int!
  }

  type CurrencyResponse {
    currency: [Currency]
    ok: Boolean!
    valErrors: [String]
  }
  
  type ConvertedAmount {
    convertedAmountDest: Float
    convertedAmountinUSD: Float
    currency: Currency
    ok: Boolean!
    valErrors: [String]
  }
  
  type currencyRate {
    cache: JSON
    ok: Boolean!
    valErrors: [String]
  }
  
  
  
  type Query {
  topCurrency: CurrencyResponse!
  currencyRate: currencyRate!
  }

  type Mutation {
    convert(amount: Int!, cur: String!, destCur: String!): ConvertedAmount!
  }

  type Subscription {
    newConvert: Currency!
  }

  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }

`
