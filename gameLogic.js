// Stores the entirety of the game's state.
let game = {
    playerData: {
        radius: 30,
        speedCap: 29.99, // Must be <radius so players can't clip through one another
        startingSpeed: 5,
        chargeRadius: 100,
        chargeSpeed: 0.01,
        collisionPenalty: 0.75,
        playerCount: 0
    },
    map: {
        width: 1000,
        height: 1000,
        spawnMargin: 30, // The closest players can spawn to the edge of the map
        minPlayers: 5,
        botCount: 0,
        botID: 0
    },
    players: {}
};

/*
 * The game logic that runs once per game tick.
 * Moves each player, then checks if any players are
 * colliding with any objects or other players before
 * handling any collisions accordingly.
 * 
 * Returns the current game state.
 */
let gameLoop = () => {
    // Add bots if player count is less than minimum
    while (game.playerData.playerCount + game.map.botCount < game.map.minPlayers) {
        addBot();
    }

    // Loop through each player
    let players = Object.values(game.players);
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        if (player.dead) continue;

        // Move player
        if (player.charging) {
            movePlayerCharge(player);
            // Increase player speed
            increaseSpeed(player, game.playerData.chargeSpeed);
        }
        movePlayerStraight(player);

        // Check if player is colliding with anything
        handleObstacleCollision(player);
        handlePlayerCollision(player, i);
    }

    return game;
}

/*
 * Checks if the player is colliding with any obstacles,
 * then handles the collision accordingly.
 */
let handleObstacleCollision = (player) => {
    // Top wall
    if (player.location.y - game.playerData.radius <= 0) {
        player.velocity.y *= -1 * game.playerData.collisionPenalty;
        player.score *= game.playerData.collisionPenalty;
        player.location.y = game.playerData.radius + 1;
    }

    // Bottom wall
    else if (player.location.y + game.playerData.radius >= game.map.height) {
        player.velocity.y *= -1 * game.playerData.collisionPenalty;
        player.score *= game.playerData.collisionPenalty;
        player.location.y = game.map.height - game.playerData.radius - 1;
    }

    // Left wall
    if (player.location.x - game.playerData.radius <= 0) {
        player.velocity.x *= -1 * game.playerData.collisionPenalty;
        player.score *= game.playerData.collisionPenalty;
        player.location.x = game.playerData.radius + 1;
    }

    // Right wall
    else if (player.location.x + game.playerData.radius >= game.map.width) {
        player.velocity.x *= Math.max(-1 * game.playerData.collisionPenalty);
        player.score *= game.playerData.collisionPenalty;
        player.location.x = game.map.width - game.playerData.radius - 1;
    }
}

/*
 * Returns the distance between two players,
 * accounting for the radius of a player.
 */
let getPlayerDistance = (player, otherPlayer) => {
        let distX = otherPlayer.location.x - player.location.x;
        let distY = otherPlayer.location.y - player.location.y;
        let dist = Math.sqrt(distX*distX + distY*distY);
        return dist - (game.playerData.radius * 2);
}

/*
 * Checks if the player is colliding with another player,
 * then handles the collision by killing one of the players.
*/
let handlePlayerCollision = (player, index) => {
    // Get list of players
    let players = Object.values(game.players);

    // Filter list of players to those colliding with the player
    let colliding = [];
    // Only search players in the list after the current player
    // since previous players were already checked
    for (let i = index + 1; i < players.length; i++) {
        let otherPlayer = players[i];
        if (otherPlayer.dead) continue;
        
        // If distance between the edges of the players <0, they're colliding
        if (getPlayerDistance(player, otherPlayer) <= 0) colliding.push(otherPlayer);
    }

    // Handle conflict and kill losing player
    duel(player, colliding);
}

/* 
 * Handles which player dies in a player collision.
 */
let duel = (player, otherPlayers) => {
    for(let otherPlayer of otherPlayers) {
        let playerVel = Math.sqrt(Math.pow(player.velocity.x, 2) + Math.pow(player.velocity.y, 2));
        let otherVel = Math.sqrt(Math.pow(otherPlayer.velocity.x, 2) + Math.pow(otherPlayer.velocity.y, 2));

        // If neither charging, faster speed wins
        if (!player.charging && !otherPlayer.charging) {
            if (playerVel >= otherVel) kill(otherPlayer, player);
            else kill (player, otherPlayer);
        }
        
        // If both are charging, faster speed wins
        else if (player.charging && otherPlayer.charging) {
            if (playerVel >= otherVel) kill(otherPlayer, player);
            else kill (player, otherPlayer);
        }

        // If one is charging, non-charging wins
        else {
            if (player.charging) kill(player, otherPlayer);
            else kill(otherPlayer, player);
        }

    }
}

/*
 * Sets a player's dead flag to true.
 */
let kill = (player, killer) => {
    let playerSpeed = Math.sqrt(player.velocity.x*player.velocity.x + player.velocity.y*player.velocity.y);
    increaseSpeed(killer, playerSpeed);
    player.dead = true;
    if (player.isBot) respawnBot(player.id);
}

/*
 * Moves the player in a circular motion centered on a point
 * perpendicular to the previous direction of motion
 */
let movePlayerCharge = (player) => {
    // Set up variables
    let vX = player.velocity.x;
    let vY = player.velocity.y;
    let speed = Math.sqrt(vX*vX + vY*vY);
    let radians = speed / game.playerData.chargeRadius;

    // Change player velocity by arc angle
    player.velocity = {
        x: Math.cos(radians)*vX - Math.sin(radians)*vY,
        y: Math.sin(radians)*vX + Math.cos(radians)*vY
    };
}

/*
 * Increases the speed of a player by
 * the global charge speed.
 */
let increaseSpeed = (player, increase) => {
    // Add increase to score
    player.score += increase;

    // Calculate current speed
    let vX = player.velocity.x;
    let vY = player.velocity.y;
    let speed = Math.sqrt(vX*vX + vY*vY);

    // Multiply increase based on current speed
    let capDiff = game.playerData.speedCap - speed;
    let multiplier = capDiff / game.playerData.speedCap;

    // Calculate new speed
    let newSpeed = speed + (increase*multiplier);
    vX = vX / Math.sqrt(speed) * Math.sqrt(newSpeed);
    vY = vY / Math.sqrt(speed) * Math.sqrt(newSpeed);
    player.velocity = { x: vX, y: vY };
}

/*
 * Moves the player in a straight line based on its velocity.
 */
let movePlayerStraight = (player) => {
    player.location.x += player.velocity.x;
    player.location.y += player.velocity.y;
}

/*
 * Adds a bot to the map.  A bot is a player object who
 * isn't controlled by a real player.
*/
let addBot = () => {
    let bot = {
        pfp: "https://tr.rbxcdn.com/0de420f369ee4d3948fd3b10b60cd8c9/420/420/Hat/Png",
        id: "bot" + game.map.botID,
        charging: null,
        dead: false,
        score: 0,
        isBot: true,
        location: getSpawnLocation(),
        velocity: getSpawnVelocity()
    };

    game.players[bot.id] = bot;

    game.map.botCount++;
    game.map.botID++;
}

/*
 * Respawns a bot as long as the total player count
 * is still below the minimum players, otherwise
 * removes the bot.
 */
let respawnBot = (id) => {
    if(game.playerData.playerCount + game.map.botCount >= game.playerData.minPlayers){
        console.log("removing bot");
        removeBot(id);
    } else {
        let bot = game.players[id];
        bot.location = getSpawnLocation();
        bot.velocity = getSpawnVelocity();
        bot.dead = false;
    }
}

let getSpawnLocation = () => {
    let spawnPadding = game.playerData.radius + game.map.spawnMargin;

    // Generate random location in the map
    let position = {
        x: (Math.random() * (game.map.width - 2*spawnPadding)) + spawnPadding,
        y: (Math.random() * (game.map.height - 2*spawnPadding)) + spawnPadding
    }

    // Test each player in the map to make sure the new
    // location isn't overlapping with any players
    let dummyPlayer = {
        location: position
    };

    for (player of Object.values(game.players)) {
        if (getPlayerDistance(dummyPlayer, player) <= 0) return getSpawnLocation();
    }

    // If no collisions, return the stored position
    return position;
}

let getSpawnVelocity = () => {
    let velNormX = Math.random();
    let velNormY = Math.sqrt(1 - velNormX*velNormX);
    return {
        x: velNormX * Math.sqrt(game.playerData.startingSpeed),
        y: velNormY * Math.sqrt(game.playerData.startingSpeed)
    };
}

/*
 * Adds a player to the player list.
 * 
 * user: the player object taken from the Roblox API.
*/
let addPlayer = (user) => {
    // Add player flags
    user.charging = null; // Will contain center point of charging circle if currently charging
    user.dead = false;
    user.score = game.playerData.startingSpeed;

    // Set new player location
    user.location = getSpawnLocation();

    // Set new player velocity
    user.velocity = getSpawnVelocity();

    // Add new player to player list
    game.players[user.id] = user;
    game.playerData.playerCount++;
}

/*
 * Removes a player from the player list.
*/
let removePlayer = (playerId) => {
    delete game.players[playerId];
    return game.playerData.playerCount--;
}

/*
 * Removes a player from the player list.
*/
let removeBot = (botId) => {
    delete game.players[botId];
    return game.playerData.botCount--;
}

/*
 * Sets a player's charging value to the center point that
 * it will be spinning around while charging.
 */
let startPlayerCharging = (player) => {
    let speed = Math.sqrt(Math.pow(player.velocity.x, 2) + Math.pow(player.velocity.y, 2));
    player.charging = {
        x: player.location.x + (player.velocity.y / speed * game.playerData.chargeRadius),
        y: player.location.y + (-player.velocity.x / speed * game.playerData.chargeRadius)
    }
}

/*
 * Stops player from charging by setting its charging value to null.
 */
let stopPlayerCharging = (player) => {
    player.charging = null;
}

module.exports = { gameLoop, addPlayer, removePlayer, startPlayerCharging, stopPlayerCharging };