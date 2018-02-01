import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import 'antd/dist/antd.css';
import Home from './components/Home';
import { unregister } from './registerServiceWorker';
import { LocaleProvider } from 'antd';
import skSk from 'antd/lib/locale-provider/sk_SK';

const isNotProduction = process.env.NODE_ENV !== 'production';
const uri = isNotProduction ? 'http://localhost:3001/graphql' : process.env.REACT_APP_GRAPHQL_URI;
const client = new ApolloClient({
  link: createHttpLink({ uri }),
  cache: new InMemoryCache(),
  // shouldBatch: true,
});

const App = (
  <ApolloProvider client={client}>
    <LocaleProvider locale={skSk}>
      <Home />
    </LocaleProvider>
  </ApolloProvider>
);
unregister();
ReactDOM.render(App, document.getElementById('root'));
unregister();
