const express = require('express');

const app = express();
app.use(express.static('frontend/public'));

const http = require('http');

const axios = require('axios');

const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);


io.on("connection", socket => {
    let user;
    socket.on("login", async input => {
        let userData;
        await axios.get
            ("https://users.roblox.com/v1/users/search?keyword=" + input.username + "&limit=10")
            .then(res => {
                userData = res.data.data[0];
            })
            .catch(res => {
                switch(res.status){
                    case 429:
                        socket.emit("loginFail", "Too many requests");
                        break;
                    case 400:
                        socket.emit("loginFail", "Username not found");
                        break;
                    default:
                        socket.emit("loginFail", "Unknown error occured");
                        break;  
                }
            })
            if(!userData) return;
            await axios.get
                ("https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=" + 
                    userData['id'] + "&size=48x48&format=Png&isCircular=true")
                    .then(res => {
                        userData.pfp = res.data.data[0]['imageUrl'];
                    })
                    .catch(res => {
                        userData.pfp = "https://i.imgur.com/2RnSO8r.png";
                    }) 
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