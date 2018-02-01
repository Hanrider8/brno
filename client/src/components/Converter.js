import React from 'react';
import { graphql, compose } from 'react-apollo';
import PropTypes from 'prop-types';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Spin, InputNumber, Select, Input, Button, Icon, Alert } from 'antd';
import { currencyRateQuery } from '../graphql/Query';
import { convertMutation } from '../graphql/Mutation';

const Option = Select.Option;
const InputGroup = Input.Group;

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
    super(props);
    extendObservable(this, {
      amount: null,
      cur: 'CZK',
      destCur: 'EUR',
      convertedAmount: null,
      convertedAmountUSD: null,
      errors: [],
    });
  }

  convert = async () => {
    const { amount, cur, destCur } = this;
    await this.props
      .convertMutation({
        variables: {
          amount,
          cur,
          destCur,
        },
        refetchQueries: ['topCurrency'],
      })
      .then(({ data }) => {
        if (data.convert.ok) {
          this.errors = [];
          this.convertedAmount = data.convert.convertedAmountDest;
          this.convertedAmountUSD = data.convert.convertedAmountinUSD;
        } else this.errors = data.convert.valErrors;
      });
  }

  ops = (options) => {
    const opss = [];
    Object.keys(options).map(k => opss.push(<Option key={k}>{k}</Option>));
    return opss;
  }

  render() {
    const { loading, error, currencyRate } = this.props.currencyRateQuery;
    const { convertedAmount, convertedAmountUSD } = this;

    if (loading) {
      return <Spin />;
    }

    if (error) {
      console.log(error);
      return <div>{error}</div>;
    }

    return (
      <div>
        <div>
          <InputGroup compact>
            <InputNumber
              min={0}
              style={{ width: 230 }}
              placeholder="Enter amount"
              onChange={value => (this.amount = value)}
              size="large"
            />
            <Select
              style={{ width: 90 }}
              defaultValue={this.cur}
              size="large"
              onChange={key => (this.cur = key)}
            >
              {this.ops(currencyRate.cache)}
            </Select>
          </InputGroup>
        </div>
        <div>
          <InputGroup compact style={{ marginTop: 20 }}>
            <InputNumber
              min={0}
              style={{ width: 230 }}
              placeholder="Press convert button "
              disabled
              size="large"
              value={convertedAmount}
            />
            <Select
              style={{ width: 90 }}
              size="large"
              defaultValue={this.destCur}
              onChange={key => (this.destCur = key)}
            >
              {this.ops(currencyRate.cache)}
            </Select>
          </InputGroup>
        </div>
        <div>
          <Button
            size="large"
            type="primary"
            disabled={!this.destCur || !this.cur || !this.amount}
            style={{ width: 320, marginTop: 20 }}
            onClick={this.convert}
          >
            <Icon type="retweet" />
            {convertedAmountUSD ? `Amount in USD: ${convertedAmountUSD}` : 'Convert'}
          </Button>
        </div>
        {this.errors.length > 0 && (
          <Alert
            style={{ width: 320, marginTop: 20 }}
            message="Error"
            description={this.errors.join(' ')}
            type="error"
            showIcon
          />
        )}
      </div>
    );
  }
}

export default compose(
  graphql(currencyRateQuery, { name: 'currencyRateQuery' }),
  graphql(convertMutation, {
    name: 'convertMutation',
    options: {
      errorPolicy: 'all',
    },
  }),
)(observer(Converter));
