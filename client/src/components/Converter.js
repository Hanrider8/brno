import React from 'react'
import { graphql, compose } from 'react-apollo'
import PropTypes from 'prop-types'
import { extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { Spin, InputNumber, Select, Input, Button } from 'antd'
import { currencyRateQuery } from '../graphql/Query'
import { convertMutation } from '../graphql/Mutation'

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

  constructor(props) {
    super(props)
    extendObservable(this, {
      amount: null,
      cur: null,
      destCur: null,
      convertedAmount: null,
      convertedAmountUSD: null,
    })
  }

  convert = async () => {
    const { amount, cur, destCur } = this
    await this.props
      .convertMutation({
        variables: {
          amount,
          cur,
          destCur,
        },
        refetchQueries: [`topCurrency`]
      })
      .then(({ data }) => {
        (this.convertedAmount = data.convert.convertedAmountDest),
        (this.convertedAmountUSD = data.convert.convertedAmountinUSD)
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
    let { convertedAmount, convertedAmountUSD } = this

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
              onChange={value => (this.amount = value)}
              size="large"
            />
            <Select
              style={{ width: 80 }}
              size="large"
              onChange={key => (this.cur = key)}
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
              value={convertedAmount}
            />
            <Select
              style={{ width: 80 }}
              size="large"
              onChange={key => (this.destCur = key)}
            >
              {this.ops(currencyRate.cache)}
            </Select>
          </InputGroup>
        </div>
        <div>
          <Button disabled={!this.destCur || !this.cur || !this.amount} onClick={this.convert}>
            {convertedAmountUSD
              ? `Amount in USD: ${convertedAmountUSD}`
              : 'Convert'}
          </Button>
        </div>
      </div>
    )
  }
}

export default compose(
  graphql(currencyRateQuery, { name: 'currencyRateQuery' }),
  graphql(convertMutation, {
    name: 'convertMutation'})
)(observer(Converter))
