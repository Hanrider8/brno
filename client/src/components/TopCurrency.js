import React from 'react'
import { graphql } from 'react-apollo'
import PropTypes from 'prop-types'
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { Spin, Card, Button } from 'antd'

import { topCurrencyQuery } from '../graphql/Query'

class TopCurrency extends React.Component {
  static propTypes = {
    data: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.object,
      topCurrency: PropTypes.object,
    }).isRequired,
  }

  constructor(props) {
    super(props)

    extendObservable(this, {
      amount: false,
    })
    console.log(props)
  }

  sort = async () => {
    console.log('amount', this.amount)
    await this.props.data.refetch({ amount: !this.amount })
    this.amount = !this.amount
    console.log('amount2', this.amount)
  }

  render() {
    const { loading, error, topCurrency } = this.props.data

    if (loading) {
      return <Card
        title="TOP 10 CURRENCY"
        loading
        extra={
          <Button type="primary" onClick={this.sort} size="small">
            {this.amount ? 'Amount' : 'Used'}
          </Button>
        }
        style={{ width: 320 }}
      >loading</Card>
    }

    if (error) {
      console.log(error)
      return <div>err</div>
    }

    return (
      <Card
        title="TOP 10 CURRENCY"
        extra={
          <Button type="primary" onClick={this.sort} size="small">
            {this.amount ? 'Amount' : 'Used'}
          </Button>
        }
        style={{ width: 320 }}
      >
        <table style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Curr</th>
              <th>Amount</th>
              <th>Used</th>
            </tr>
          </thead>
          {topCurrency.currency.map(cur => (
            <tbody key={cur.name}>
              <tr>
                <td>{cur.name}</td>
                <td>{cur.converted} $</td>
                <td>{cur.requests}</td>
              </tr>
            </tbody>
          ))}
        </table>
      </Card>
    )
  }
}

export default graphql(topCurrencyQuery)(observer(TopCurrency))
