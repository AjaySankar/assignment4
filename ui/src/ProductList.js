/* eslint-disable react/prop-types */

import React, { Component } from "react"
import { graphql } from "react-apollo"
import { gql } from "apollo-boost"
import ProductForm from "./ProductForm"

const getProductsQuery = gql`
  {
    getProducts {
      id
      category
      name
      price
      image
    }
  }
`

class ProductList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: null,
    }
    this.handleSave = this.handleSave.bind(this)
  }

  handleSave() {
    this.setState((prevState) => ({ ...prevState }))
  }

  render() {
    const { formData } = this.state
    const {
      allProductsQuery: { loading, error, getProducts },
    } = this.props
    if (loading) {
      return (
        <div>
          <p> Loading Products... </p>
        </div>
      )
    }
    if (error) {
      return (
        <div>
          <p> Error has occured while fetching products ... </p>
        </div>
      )
    }
    return (
      <div>
        <ProductTable products={getProducts || []} />
        <h3> Add a new product to inventory </h3>
        <hr />
        <ProductForm
          key={JSON.stringify(formData || {})}
          formInput={formData}
          onSave={this.handleSave}
        />
      </div>
    )
  }
}

function ProductRow(props) {
  const {
    product: { price = "", name = "", image = "#", category = "" },
  } = props
  return (
    <tr>
      <td> {name} </td>
      <td> ${price} </td>
      <td> {category} </td>
      <td>
        {" "}
        <a href={image} target="__blank">
          {" "}
          View{" "}
        </a>{" "}
      </td>
    </tr>
  )
}

function ProductTable(props) {
  const { products = [] } = props
  const rows = products.map((productInfo) => {
    return <ProductRow key={productInfo.id} product={productInfo} />
  })
  return (
    <table>
      <thead>
        <tr>
          <th> Product Name </th>
          <th> Price </th>
          <th> Category </th>
          <th> Image </th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

export default graphql(getProductsQuery, { name: "allProductsQuery" })(
  ProductList
)
