export default `
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
    convertedAmount: Float
    currency: Currency
    ok: Boolean!
    valErrors: [String]
  }
  
  type currencyRate {
    name: String
    rate: Float
    ok: Boolean!
    valErrors: [String]
  }
  
  
  
  type Query {
  topCurrency: CurrencyResponse!
  currencyRate(cur: String): [currencyRate]!
  }

  type Mutation {
    convert(amount: Float!, cur: String!, destCur: String!): ConvertedAmount!
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
