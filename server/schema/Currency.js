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
    ok: Boolean!
    valErrors: [String]
  }
  
  type currencyRate {
    cache: JSON
    ok: Boolean!
    valErrors: [String]
  }
  
  
  
  type Query {
  topCurrency(amount: Boolean): CurrencyResponse!
  currencyRate: currencyRate!
  }

  type Mutation {
    convert(amount: Float!, cur: String!, destCur: String!): ConvertedAmount!
  }

  schema {
    query: Query
    mutation: Mutation
  }
`
