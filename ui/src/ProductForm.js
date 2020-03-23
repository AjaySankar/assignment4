/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { Component } from "react"
import { graphql } from "react-apollo"
import { gql } from "apollo-boost"

const RESET_VALUES = { name: "", price: "$", category: "Shirts", image: "" }

const addProductMutation = gql`
  mutation addProduct(
    $category: Category!
    $name: String!
    $price: Float!
    $image: String!
  ) {
    addProduct(
      product: {
        category: $category
        name: $name
        price: $price
        image: $image
      }
    ) {
      id
      category
      name
      price
      image
    }
  }
`

class ProductForm extends Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
    this.handleSave = this.handleSave.bind(this)
    const { formInput } = this.props
    this.state = {
      product: formInput || { ...RESET_VALUES },
    }
  }

  handleChange({ target }) {
    const { name, value } = target
    this.setState(({ product: prevProduct }) => {
      return { product: { ...prevProduct, ...{ [name]: value } } }
    })
  }

  handleSave(e) {
    const { product } = this.state
    const { category, name, image } = product
    const price = parseFloat(product.price.substring(1)) || 0
    const { addProduct, onSave } = this.props
    const promise = addProduct({
      variables: {
        category,
        name,
        price,
        image,
      },
    })
    promise
      // eslint-disable-next-line no-unused-vars
      .then(({ data = {} }) => {
        // On succesful product save, refresh the product table
        onSave()
        // reset the form values to blank after submitting
        this.setState({
          product: { ...RESET_VALUES },
        })
      })
      .catch((error) => {
        window.console.error(
          `Error occured while add new product: ${error || ""}`
        )
      })
      .finally(() => e.preventDefault()) // prevent the form submit event from triggering an HTTP Post
  }

  render() {
    const {
      product: { price, name, image },
    } = this.state
    return (
      <form>
        <label>Category</label>
        <label>Price Per Unit </label>
        <select name="category" onBlur={this.handleChange}>
          <option value="Shirts">Shirts</option>
          <option value="Jeans">Jeans</option>
          <option value="Jackets">Jackets</option>
          <option value="Sweaters">Sweaters</option>
          <option value="Accessories">Accessories</option>
        </select>
        <input
          type="text"
          name="price"
          onChange={this.handleChange}
          value={price}
        />
        <label>Product Name </label>
        <label>Image URL </label>
        <input
          type="text"
          name="name"
          onChange={this.handleChange}
          value={name}
        />
        <input
          type="text"
          name="image"
          onChange={this.handleChange}
          value={image}
        />
        <input type="submit" value="Add Product" onClick={this.handleSave} />
      </form>
    )
  }
}

export default graphql(addProductMutation, { name: "addProduct" })(ProductForm)
