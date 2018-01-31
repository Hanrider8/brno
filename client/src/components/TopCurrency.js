import React from 'react'
import gql from 'graphql-tag'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import { Spin, Card } from 'antd'

class TopCurrency extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.object,
      topCurrency: PropTypes.object,
    }).isRequired,
  }

  render() {
    const { loading, error, topCurrency } = this.props.data

    if (loading) {
      return <Spin />
    }

    if (error) {
      console.log(error)
      return <div>err</div>
    }

    return (
      <Card title="TOP CURRENCY" style={{ width: 200 }}>
        {topCurrency.currency.map(cur => (
          <p key={cur.name}>
            {cur.name} - {cur.converted} - {cur.requests}
          </p>
        ))}
      </Card>
    )
  }
}

const topCurrencyQuery = gql`
  {
    topCurrency {
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

export default graphql(topCurrencyQuery)(TopCurrency)
