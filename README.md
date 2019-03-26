websocket-room
---

This websocket server will broadcast all messages it receives to sockets connected to the same URL.

Client-side, you can connect with `new WebSocket(url)`, or use the wrapper in `public/connectable.js` that will try to reconnect.

```
// Connect to `room-name`
const socket = connectable('ws://localhost:8080/room-name')

// Log all messages in `room-name`
socket.subscribe(console.log)

// Send a chat message
form.onsubmit = () => socket.send(nameInput.value)
```
