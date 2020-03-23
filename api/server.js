const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const typeDefs = fs.readFileSync('./schema.graphql', { encoding: 'utf-8' });
const defaultProductInfo = {
  id: 0, name: '', category: 'NA', price: 0, image: '',
};
let db = null;
const { MongoClient } = require('mongodb');

function getProductsFromMongo() {
  if (!db) {
    throw new Error('Empty database connection!!');
  }
  const promise = new Promise((resolve, reject) => {
    const collection = db.collection('products');
    collection.find({})
      .toArray((err, products) => {
        if (err) {
          reject(err);
        } else {
          resolve(products);
        }
      });
  });
  return promise;
}

const resolvers = {
  Query: {
    getProducts: () => {
      try {
        return getProductsFromMongo();
      } catch (error) {
        console.log(`Fetching products from mongo db failed ${error}`);
        return [];
      }
    },
  },
  Mutation: {
    addProduct: (root, args) => {
      if (!db) {
        throw new Error('Empty database connection!!');
      }
      const collection = db.collection('products');
      collection.countDocuments({}).then((count) => {
        const newProduct = { ...defaultProductInfo, ...args.product || {}, id: count + 1 };
        const promise = collection.insertOne(newProduct);
        // eslint-disable-next-line no-unused-vars
        promise.then(({ insertedId }) => {
          const { id } = newProduct;
          collection.findOne({ id })
            .then((product) => product);
        });
      })
        .catch((error) => console.log(`Product insertion failed: ${error}`));
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();

app.use(cors());

server.applyMiddleware({ app });

const port = process.env.API_SERVER_PORT || 3000;
app.listen(port, () => {
  console.log(`Server started listening on port ${port}`);
  const url = process.env.DB_URL || 'mongodb://localhost/products';
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect().then(() => {
    db = client.db();
  })
    .catch((error) => console.log(error));
});
