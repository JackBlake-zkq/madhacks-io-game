const express = require('express');

const app = express();
app.use(express.static('frontend/public'));

const http = require('http');

const axios = require('axios');

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

let currID = 0;

io.on("connection", socket => {
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
                userData = res.data.data[0];
            })
            if(userData)
                await axios.get
                    ("https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" + 
                        userData['id'] + "&size=48x48&format=Png&isCircular=true")
                        .then(res => {
                            userData.pfp = res.data.data[0]['imageUrl'];
                        })
            userData.id = currID++;
            user = userData;
            console.log(user);
            socket.emit("loginSuccessful", user);
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
server.listen(port, () => {
  console.log(`listening on ${port} 🚀`);
});