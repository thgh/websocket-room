const port = process.env.PORT || 8080

const WebSocketServer = require('ws').Server
const express = require('express')
const path = require('path')
const app = express()
const server = require('http').createServer()

const wss = new WebSocketServer({ server })

const rooms = {}

wss.on('connection', function(ws, req) {
  const roomName = req.url

  // Create room
  if (!rooms[roomName]) {
    console.log(roomName, 'create')
    rooms[roomName] = []
  }
  rooms[roomName].push({ ws })
  console.log(roomName, rooms[roomName].length, 'subs')

  ws.on('message', function(data) {
    console.log(roomName, 'message', data.slice(0, 80))
    rooms[roomName].forEach(node => {
      if (node.ws !== ws) {
        node.ws.send(data)
      }
    })
  })

  ws.on('close', function() {
    console.log(roomName, rooms[roomName].length, 'subs')
    rooms[roomName] = rooms[roomName].filter(node => node.ws !== ws)
    // cleanup room
    if (!rooms[roomName].length) {
      console.log(roomName, 'delete')
      delete rooms[roomName]
    }
  })

  ws.on('error', function(err) {
    console.log(roomName, 'error', err.message)
    ws.close();
  })
})

// HTTP

function index(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
}
app.get('/', index);
app.get('/:foo', index);

server.on('request', app)
server.listen(port, function() {
  console.log('Listening on http://localhost:' + port)
})
