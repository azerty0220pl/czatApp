const { Server } = require('socket.io');
const passportSocketIo = require('passport.socketio');
const cookieParser = require('cookie-parser');

const socket = (server, store) => {
    const io = new Server(server, {
        cors: {
            origin: 'https://azerty0220pl.github.io',
            methods: ['GET', 'POST']
        },
        transports: ['websocket'],
        path: '/socket.io'
    });
    
    io.use(
      passportSocketIo.authorize({
        cookieParser: cookieParser,
        key: 'express.sid',
        secret: process.env.SESSION_SECRET,
        store: store,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
      })
    );

    return io;
}

function onAuthorizeSuccess(data, accept) {
  accept(null, true);
}

function onAuthorizeFail(data, message, error, accept) {
  accept(null, false);
}

module.exports = {
    socket: socket
}