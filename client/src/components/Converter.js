import React from 'react'
import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'
import { Spin, InputNumber, Select, Input, Button } from 'antd'

const Option = Select.Option
const InputGroup = Input.Group

class Converter extends React.Component {
  static propTypes = {
    currencyRateQuery: PropTypes.shape({
      loading: PropTypes.bool,
      error: PropTypes.object,
      currencyRate: PropTypes.object,
    }).isRequired,
    convertMutation: PropTypes.func.isRequired,
  }

  //to-do mobx replace state
  state = {
    amount: null,
    cur: null,
    destCur: null,
    convertedAmount: null,
    convertedAmountUSD: null,
  }

  convert = async () => {
    const { amount, cur, destCur } = this.state
    console.log('convert ', amount, cur, destCur)
    await this.props
      .convertMutation({
        variables: {
          amount,
          cur,
          destCur,
        },
      })
      .then(({ data }) => {
        console.log('data', data)
        this.setState({
          convertedAmount: data.convert.convertedAmountDest,
          convertedAmountUSD: data.convert.convertedAmountinUSD,
        })
      })
  }

  ops = options => {
    const opss = []
    {
      Object.keys(options).map(k => opss.push(<Option key={k}>{k}</Option>))
    }
    return opss
  }

  render() {
    const { loading, error, currencyRate } = this.props.currencyRateQuery

    if (loading) {
      return <Spin />
    }

    if (error) {
      console.log(error)
      return <div>err</div>
    }

    return (
      <div>
        <div>
          <InputGroup compact>
            <InputNumber
              min={0}
              style={{ width: 150 }}
              onChange={value => this.setState({ amount: value })}
              size="large"
            />
            <Select
              style={{ width: 80 }}
              size="large"
              onChange={key => this.setState({ cur: key })}
            >
              {this.ops(currencyRate.cache)}
            </Select>
          </InputGroup>
        </div>
        <div>
          <InputGroup compact>
            <InputNumber
              min={0}
              style={{ width: 150 }}
              disabled
              size="large"
              value={this.state.convertedAmount}
            />
            <Select
              style={{ width: 80 }}
              size="large"
              onChange={key => this.setState({ destCur: key })}
            >
              {this.ops(currencyRate.cache)}
            </Select>
          </InputGroup>
        </div>
        <div>
          <Button onClick={this.convert}>
            {this.state.convertedAmountUSD
              ? `Amount in USD: ${this.state.convertedAmountUSD}`
              : 'Convert'}
          </Button>
        </div>
      </div>
    )
  }
}

const currencyRateQuery = gql`
  {
    currencyRate {
      cache
      ok
      valErrors
    }
  }
`

const convertMutation = gql`
  mutation convert($amount: Int!, $cur: String!, $destCur: String!) {
    convert(amount: $amount, cur: $cur, destCur: $destCur) {
      ok
      convertedAmountDest
      convertedAmountinUSD
      currency {
        name
        converted
        requests
      }
    }
  }
`

export default compose(
  graphql(currencyRateQuery, { name: 'currencyRateQuery' }),
  graphql(convertMutation, { name: 'convertMutation' })
)(Converter)
