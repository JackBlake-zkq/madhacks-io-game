// Stores the entirety of the game's state.
let game = {
    playerData: {
        radius: 5,
        startingSpeed: 5
    },
    map: {
        width: 100,
        height: 100,
        spawnMargin: game.playerData.radius // The closest players can spawn to the edge of the map
    },
    players: []
};

const __player = {
    charging: false,
    dead: false
}

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
    for (let i = 0; i < game.players.length; i++) {
        let player = game.players[i];

        // Move player
        if (player.charging) movePlayerCharge(player);
        else movePlayerStraight(player);

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
    // Handle wall collision
    let verticalWall = (player.location.y - game.playerData.radius <= 0) || (player.location.y + game.playerData.radius >= game.map.height);
    let horizontalWall = (player.location.x - game.playerData.radius <= 0) || (player.location.x + game.playerData.radius >= game.map.width);
    if (verticalWall) player.velocity.y *= -1;
    if (horizontalWall) player.velocity.x *= -1;
}

/*
 * Checks if the player is colliding with another player,
 * then handles the collision by killing one of the players.
*/
let handlePlayerCollision = (player, index) => {
    // Filter list of players to those colliding with the player
    let colliding = [];
    // Only search players in the list after the current player
    // since previous players were already checked
    for (let i = index + 1; i < game.players.length; i++) {
        let otherPlayer = game.players[i];
        if (otherPlayer.dead) continue;
        
        // Find distance between the centers of the players
        let distX = otherPlayer.location.x - player.location.x;
        let distY = otherPlayer.location.y - player.location.y;
        let dist = Math.sqrt(distX*distX + distY*distY);

        // If distance between the edges of the players <0, they're colliding
        if (dist - (game.playerData.radius * 2)) colliding.push(otherPlayer);
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

let movePlayerCharge = (player) => {
    // TODO
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
 * name: the player name
 * picture: the URL to the player's profile picture
*/
let addPlayer = (name, picture) => {
    let newPlayer = Object.create(__player);

    // Set new player info
    newPlayer.name = name;
    newPlayer.picture = picture;

    // Set new player position
    let spawnPadding = game.playerData.radius + game.map.spawnMargin;
    newPlayer.position = {
        x: (Math.random() * (game.map.width - 2*spawnPadding)) + spawnPadding,
        y: (Math.random() * (game.map.height - 2*spawnPadding)) + spawnPadding
    };

    // Set new player velocity
    let velNormX = Math.random();
    let velNormY = Math.sqrt(1 - velNormX*velNormX);
    newPlayer.velocity = {
        x: velNormX * Math.sqrt(game.playerData.startingSpeed),
        y: velNormY * Math.sqrt(game.playerData.startingSpeed)
    };

    game.players.push();
}

/*
 * Removes a player from the player list.
*/
let removePlayer = (player) => {
    game.players = game.players.filter(currentPlayer => currentPlayer !== player);
}