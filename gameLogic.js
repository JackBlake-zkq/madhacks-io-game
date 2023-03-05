// Stores the entirety of the game's state.
let game = {
    playerData: {
        radius: 20,
        startingSpeed: 5,
        chargeRadius: 100,
        chargeSpeed: 0
    },
    map: {
        width: 1000,
        height: 1000,
        spawnMargin: 20 // The closest players can spawn to the edge of the map
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
    // Loop through each player
    let players = Object.values(game.players);
    for (let i = 0; i < players.length; i++) {
        let player = players[i];
        if (player.dead) continue;

        // Move player
        if (player.charging) {
            movePlayerCharge(player);
            // Increase player speed
            //increaseSpeed(player); // TODO
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
        player.velocity.y *= -1;
        player.location.y = game.playerData.radius + 1;
    }

    // Bottom wall
    else if (player.location.y + game.playerData.radius >= game.map.height) {
        player.velocity.y *= -1;
        player.location.y = game.map.height - game.playerData.radius - 1;
    }

    // Left wall
    if (player.location.x - game.playerData.radius <= 0) {
        player.velocity.x *= -1;
        player.location.x = game.playerData.radius + 1;
    }

    // Right wall
    else if (player.location.x + game.playerData.radius >= game.map.width) {
        player.velocity.x *= -1;
        player.location.x = game.map.width - game.playerData.radius - 1;
    }
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
        
        // Find distance between the centers of the players
        let distX = otherPlayer.location.x - player.location.x;
        let distY = otherPlayer.location.y - player.location.y;
        let dist = Math.sqrt(distX*distX + distY*distY);

        // If distance between the edges of the players <0, they're colliding
        if (dist - (game.playerData.radius * 2) <= 0) colliding.push(otherPlayer);
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
            if (playerVel >= otherVel) kill(otherPlayer);
            else kill (player);
        }
        
        // If both are charging, faster speed wins
        else if (player.charging && otherPlayer.charging) {
            if (playerVel >= otherVel) kill(otherPlayer);
            else kill (player);
        }

        // If one is charging, non-charging wins
        else {
            if (player.charging) kill(player);
            else kill(otherPlayer);
        }

    }
}

/*
 * Sets a player's dead flag to true.
 */
let kill = (player) => {
    player.dead = true;
}

/*
 * Moves the player in a circular motion centered on a point
 * perpendicular to the previous direction of motion
 */
let movePlayerCharge = (player) => {
    // Set up variables
    let vX = player.velocity.x;
    let vY = player.velocity.y;
    let cX = player.charging.x;
    let cY = player.charging.y;
    let pX = player.location.x;
    let pY = player.location.y;
    let speed = Math.sqrt(vX*vX + vY*vY);
    let radians = speed / game.playerData.chargeRadius;

    /*
    // Convert speed to arc length, find point at that arc length
    let newX = cX + ((pX - cX)*Math.cos(radians)) + ((cY - pY)*Math.sin(radians));
    let newY = cY + ((pY - cY)*Math.cos(radians)) + ((pX - cX)*Math.sin(radians));
    
    // Set player location to new location
    player.location = { x: newX, y: newY };
    */

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
let increaseSpeed = (player) => {
    let vX = player.velocity.x;
    let vY = player.velocity.y;
    let speed = Math.sqrt(vX*vX + vY*vY);
    let newSpeed = speed + game.playerData.chargeSpeed;
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
 * Adds a player to the player list.
 * 
 * user: the player object taken from the Roblox API.
*/
let addPlayer = (user) => {
    // Add player flags
    user.charging = null; // Will contain center point of charging circle if currently charging
    user.dead = false;

    // Set new player location
    let spawnPadding = game.playerData.radius + game.map.spawnMargin;
    user.location = {
        x: (Math.random() * (game.map.width - 2*spawnPadding)) + spawnPadding,
        y: (Math.random() * (game.map.height - 2*spawnPadding)) + spawnPadding
    };

    // Set new player velocity
    let velNormX = Math.random();
    let velNormY = Math.sqrt(1 - velNormX*velNormX);
    user.velocity = {
        x: velNormX * Math.sqrt(game.playerData.startingSpeed),
        y: velNormY * Math.sqrt(game.playerData.startingSpeed)
    };

    // Add new player to player list
    game.players[user.id] = user;
}

/*
 * Removes a player from the player list.
*/
let removePlayer = (playerId) => {
    delete game.players[playerId];
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

let togglePlayerCharging = (playerId) => {
    let player = game.players[playerId];
    if (player.charging) stopPlayerCharging(player);
    else startPlayerCharging(player);
}

module.exports = { gameLoop, addPlayer, removePlayer, startPlayerCharging, stopPlayerCharging };