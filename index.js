const express = require('express');

const app = express();
app.use(express.static('frontend/public'));

const http = require('http');

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);


io.on("connection", socket => {
    let user;
    socket.on("login", ({ _username, password }) => {
        // make login request
        // if succesful:
        //     username = _username
        //     profilePic = get profile pic from thumbnails API
        //     socket.emit("login-successful");
        // otherwise:
        //     socket.emit("login-fail");
    });
    socket.on("join-game", () => {

    });
        socket.on("keydown", () => {
        
    });
    socket.on("keyup", () => {
        
    });
    socket.on('disconnect', () => {

    });
});
    

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port} 🚀`);
});