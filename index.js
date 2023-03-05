const express = require('express');

const app = express();
app.use(express.static('frontend/public'));

const http = require('http');

const axios = require('axios');

const { gameLoop, addPlayer, removePlayer, startPlayerCharging, stopPlayerCharging } = require("./gameLogic");

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

let currID = 0;
let loop = null;

io.on("connection", socket => {
    if(!loop) {
        loop = setInterval(() => {
            let state = gameLoop();
            io.emit("gameTick", state);
        }, 10);
    }
    let user;
    socket.on("login", async input => {
        let userData = {
            name: input.username.slice(0, 20),
            pfp: "https://i.imgur.com/2RnSO8r.png"
        }
        if(input.username.length < 3){
            socket.emit("loginFailed", "Username must be at least 3 characters");
            return;
        }
        await axios.get
            ("https://users.roblox.com/v1/users/search?keyword=" + input.username + "&limit=10")
            .then(res => {
                Object.assign(userData, res.data.data[0])
            })
            .catch(() => {});

            if(userData.id)
                await axios.get
                    ("https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" + 
                        userData['id'] + "&size=48x48&format=Png&isCircular=true")
                        .then(res => {
                            userData.pfp = res.data.data[0]['imageUrl'];
                        })
                        .catch(() => {});
            userData.id = currID++;
            user = userData;
            socket.emit("loginSuccessful", user);
    });
    
    socket.on("joinGame", () => {
        if(user) addPlayer(user);
    });
    socket.on("keydown", () => {
        if(user) startPlayerCharging(user);
    });
    socket.on("keyup", () => {
        if(user) stopPlayerCharging(user);
    });
    socket.on('disconnect', () => {
        if(user) {
            let playerCount = removePlayer(user.id);
            if(playerCount < 1) {
                clearInterval(loop);
                loop = null;
            }
        }
    });
});
    

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`listening on ${port} 🚀`);
});