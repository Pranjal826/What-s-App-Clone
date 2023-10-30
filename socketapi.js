const io = require("socket.io")();
const socketapi = {
    io: io
};
const rooms = {};
const roomOwners={}
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
            
            // Emit a message to the room to inform others that the current user has joined
            socket.to(data.roomName).emit('userJoinedMsg', {
                username: data.username
            });
    
            console.log(`User ${data.username} joined room '${data.roomName}'`);
        } else {
            socket.emit('roomNotFound', data.roomName);
        }
    });
    
    socket.on('sony', (msg) => {
        console.log(msg);
        socket.broadcast.to(msg.roomName).emit('max', msg);
    });


    
    
    
    
    socket.on('disconnect', () => {
        const roomName = roomOwners[socket.id];
        if (roomName) {
            socket.leave(roomName);
        }
    
        delete roomOwners[socket.id];

        console.log("A user disconnected");
    });
});

module.exports = socketapi;
