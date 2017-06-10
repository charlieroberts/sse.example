const express = require('express'),
      app = express(),
      static = require('connect-static-file'),
      sse = require( 'sse-pusher' ),
      clients = []

let uid = 0

// store all clients
app.get( '/', (req,res,next)=> {
  req.client.uid = uid++    
  clients.push( req.client )
  next()
})

// statically deliver page
app.get( '/', static( './index.html' ) )

// handle requests for sse
app.get( '/sse/', ( req, res, next ) => {
  // create client-specific sse stream
  req.client.push = sse()

  // store sse middleware for client
  req.client.handler = req.client.push.handler()

  // pass event stream object
  req.client.handler( req, res, next )
} )

// start app on port 9080
app.listen( 9080 )

// push client id to each client
setInterval( ()=> {
  clients.forEach( c => c.push({ id:c.uid }) )
}, 1000 )
