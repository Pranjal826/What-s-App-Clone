const io = require("socket.io")();
const socketapi = {
    io: io
};
// Add your socket.io logic here!
io.on("connection", function (socket) {
    console.log("A user connected");
    socket.on('sony', msg => {
        console.log(msg)
        socket.broadcast.to(msg.roomName).emit('max', msg)
    })
    socket.on('joinRoom', roomName => {
        socket.join(roomName)
    })

});
// Disconnect
io.on("disconnect", function () {
    console.log("A user disconnected");
});

module.exports = socketapi;