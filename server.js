const http = require('http');
const app = require('./app');

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '4242');
app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port);

//Chat script
const {addUser, removeUser, getUser, getUsersInRoom} = require('./chat/users')
const socketio = require('socket.io')
const io = socketio(server)

io.on('connection', (socket) => {
  console.log('New connection', socket.id)

  socket.on('join', ({username, room}, callback) => {
    
    const {error, user } = addUser({id:socket.id, username, room})

    if(error){ return callback(error)}
    socket.emit('message', {user: 'admin', text: `${user.username}, welcome to the room ${user.room}`})
    socket.broadcast.to(user.room).emit('message', {user: 'admin', text: `${user.name}, has joined`})

    socket.join(user.room)

    callback()
  })

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id)
    io.to(user.room).emit('message', {user: user.name, text: message})

    callback()
  })

  socket.on('disconnect', () => {
    const user = removeUser(socket.id)
    if(user){
      io.to(user.room).emit('message', {user: 'admin', test: `${user.name} has left.`})
    }
  })


})

