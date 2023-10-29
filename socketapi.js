const io = require("socket.io")();
const socketapi = {
    io: io
};
const rooms = {};

io.on("connection", function (socket) {
    console.log("A user connected");

    socket.on('createRoom', (data) => {
        if (!rooms[data.roomName]) {
            rooms[data.roomName] = {
                password: data.password,
                users: [socket.id]
            };
            socket.join(data.roomName);
            socket.emit('roomCreated', data.roomName);
            console.log(`Room '${data.roomName}' created`);
        } else {
            socket.emit('roomExists', data.roomName);
        }
    });

    socket.on('joinRoom', (data) => {
        const room = rooms[data.roomName];
        if (room && room.password === data.password) {
            room.users.push(socket.id);
            socket.join(data.roomName);
            socket.emit('roomJoined', data.roomName);
            console.log(`User joined room '${data.roomName}'`);
        } else {
            socket.emit('roomNotFound', data.roomName);
        }
    });

    socket.on('sony', (msg) => {
        console.log(msg);
        socket.broadcast.to(msg.roomName).emit('max', msg);
    });

    socket.on('disconnect', () => {
        // Remove the user from all rooms they were part of
        for (const roomName in rooms) {
            const index = rooms[roomName].users.indexOf(socket.id);
            if (index !== -1) {
                rooms[roomName].users.splice(index, 1);
                socket.leave(roomName);
            }
        }
        console.log("A user disconnected");
    });
});

module.exports = socketapi;
