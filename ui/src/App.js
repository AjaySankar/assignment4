import React from "react"
import ApolloClient from "apollo-boost"
import { ApolloProvider } from "react-apollo"
import ProductList from "./ProductList"

import "./App.css"

const client = new ApolloClient({
  uri: "http://localhost:3000/graphql",
})

function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h1> My Company Inventory </h1>
        <h3> Showing all available products </h3>
        <hr />
        <ProductList />
      </div>
    </ApolloProvider>
  )
}

export default App
