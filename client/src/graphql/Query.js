import gql from 'graphql-tag'

export const currencyRateQuery = gql`
  {
    currencyRate {
      cache
      ok
      valErrors
    }
  }
`

export const topCurrencyQuery = gql`
  query topCurrency($amount: Boolean) {
    topCurrency(amount: $amount) {
      ok
      valErrors
      currency {
        name
        converted
        requests
      }
    }
  }
`
