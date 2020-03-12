import React, {Component} from 'react';
import ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo';
import ProductList from './ProductList';

import './App.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div>
          <h1> My Company Inventory </h1>
          <h3> Showing all available products </h3>
          <hr/>
          <ProductList/>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
