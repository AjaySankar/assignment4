import React, {Component} from 'react';
import ProductForm from './ProductForm';
import {graphql} from 'react-apollo';
import {gql} from 'apollo-boost';

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
        formData: null
      }
      this.handleSave = this.handleSave.bind(this)
    }

    handleSave() {
      this.setState((prevState) => {
        return {...this.state}
      })
    }
    render() {
      if(this.props.allProductsQuery && this.props.allProductsQuery.loading) {
         return (<div> 
             <p> Loading Products... </p>
         </div>)
      }
      if(this.props.allProductsQuery && this.props.allProductsQuery.error) {
        return (<div> 
            <p> Error has occured while fetching products ... </p>
        </div>)
      }
      return (
        <div>
        <ProductTable products={this.props.allProductsQuery.getProducts || []}/>
        <h3> Add a new product to inventory </h3>
        <hr/>
        <ProductForm
          key={JSON.stringify(this.state.formData || {})} formInput={this.state.formData} onSave={this.handleSave}/>
        </div>
      )
    }
  }
  
  class ProductRow extends React.Component {
    constructor(props) {
      super(props)
    }
    render() {
      return (
        <tr>
          <td> {this.props.product.name || ' '} </td>
          <td> ${this.props.product.price || ' '} </td>
          <td> {this.props.product.category || ' '} </td>
          <td> <a href = {this.props.product.image || '#'} target="__blank"> View </a> </td>
        </tr>
      )
    }
  }
  
  class ProductTable extends React.Component {
    constructor(props) {
      super(props)
    }
    render() {
      const rows = this.props.products.map(productInfo => {
        return <ProductRow key={productInfo.id} product={productInfo}/>
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
          <tbody>
            {rows}
          </tbody>
        </table>
      )
    }
  }

  export default graphql(getProductsQuery, {name: 'allProductsQuery'}) (ProductList)