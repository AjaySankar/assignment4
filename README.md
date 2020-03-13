# assignment4
CS-648 Assignment 4

Run the following commands to start the server.
* cd api/
* Run **npm run start** to open a graphql server at port 3000. Open the url http://localhost:3000/graphql in your favuorite browser to open server playground to send queries and mutations.

Following is the query to get the list of products.

```
{
  getProducts {
    id
    category
    name
    price
    image
  }
}
```

Following is the example mutation to add a new product.

```
mutation {
  addProduct(
    product: {
    category: Shirts
    name: "T-Shirt"
    price: 5.33
    image: "https://instagram.com/"
    }
  ) {
    id
    category
    name
    price
    image
  }
}

```

Run the following commands to create a client instance.

* cd ui/
* Run **npm run start** to open a graphql client at port 8000.
* Open the url http://localhost:8000/ in your favuorite browser.