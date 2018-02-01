import gql from 'graphql-tag';

export const convertMutation = gql`
  mutation convert($amount: Float!, $cur: String!, $destCur: String!) {
    convert(amount: $amount, cur: $cur, destCur: $destCur) {
      ok
      convertedAmountDest
      convertedAmountinUSD
      valErrors
    }
  }
`;
