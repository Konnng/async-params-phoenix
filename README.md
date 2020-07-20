## async-params-phoenix

This package is just a wrapper that allows to use Phoenix.js `params` option as a Promise.

There are some cases that we need to wait for a token or other info to send to the WS. Since Phoenix.js acts like a syncronous socket, we need to add a extra layer to handle the promise, then connect to the WS.

### example

```js
import AsyncPhoenixSocket from 'async-params-phoenix'
// import ....

const phoenixSocket = new AsyncPhoenixSocket(API_ENDPOINT_WS, {
  params: async () => { // Promise
    const socketToken = (await asyncMethodtoRetrieveFromStore('socketToken')) || ''
    if (!socketToken) {
      throw new Error('Error message goes here')
    }
    const headers = {
      token: socketToken
    }

    return headers
  }
})

const absintheSocket = create(phoenixSocket)
const socketLink = createAbsintheSocketLink(absintheSocket, onError, onStart)

// [...]

const link = ApolloLink.from([socketLink])
const cache = new InMemoryCache()

// [...]
const client = new ApolloClient({
  link,
  cache
})
// ...
```
