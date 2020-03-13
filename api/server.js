const find = require('lodash/find')
const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express');
const cors = require('cors');
const fs = require('fs')
const typeDefs = fs.readFileSync('./schema.graphql',{encoding:'utf-8'})
const defaultProductInfo = {id: 0, name: '', category: 'NA', price: 0, image: ''}
let db = null;
const { MongoClient } = require('mongodb');

const products = []

function getProductsFromMongo() {
  if(db) {
    const p = new Promise((resolve, reject) => {
      const collection = db.collection('products');
      collection.find({})
        .toArray((err, products) => {
          if(err) {
            reject(err)
          }
          else {
            resolve(products)
          }
      });
    })
    return p;
  }
}

const resolvers = {
  Query: {
    products: () => products,
    getProducts: () => {
      try {
        return getProductsFromMongo();
      }
      catch(error) {
        console.log(`Fetching products from mongo db failed ${error}`)
        return []
      }
    }
  },
  Mutation: {
    addProduct: (root, args) => {
      const newProduct = Object.assign({}, defaultProductInfo, args.product || {}, {'id': Math.floor((Math.random() * 1000000) + 1)});
      products.push(newProduct)
      const id = newProduct.id
      return find(products, (product) => product.id == id)
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

app.use(cors());

server.applyMiddleware({ app });

app.listen(4000, () => {
  console.log("Server started listening on port 4000");
  const url = 'mongodb://localhost/products';
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect().then(() => {
      db = client.db();
  })
  .catch((error) => console.log(error))
})