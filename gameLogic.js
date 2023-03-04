// Stores the entirety of the game's state.
let game = {
    playerData: {
        radius: 5
    },
    players: [
        {
            location: {
                x: 0,
                y: 0
            },
            velocity: {
                x: 0,
                y: 0
            },
            charging: false,
            dead: false
        }
    ],
    map: {
        width: 100,
        height: 100
    },
    obstacles: []
};

/*
 * The game logic that runs once per game tick.
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

    // Emit gameTick event with current game state
    // TODO
}

/*
 * Checks if the player is colliding with any obstacle,
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
    for(otherPlayer of otherPlayers) {
        playerVel = Math.sqrt(Math.pow(player.velocity.x, 2) + Math.pow(player.velocity.y, 2));
        otherVel = Math.sqrt(Math.pow(otherPlayer.velocity.x, 2) + Math.pow(otherPlayer.velocity.y, 2));

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

let kill = (player) => {
    // TODO
}

let movePlayerCharge = (player) => {
    // TODO
}

let movePlayerStraight = (player) => {
    player.location.x += player.velocity.x;
    player.location.y += player.velocity.y;
}

let addPlayer = () => {
    // TODO
}

let removePlayer = () => {
    // TODO
}