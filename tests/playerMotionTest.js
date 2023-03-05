const { gameLoop, addPlayer, removePlayer, togglePlayerCharging } = require("../gameLogic");

for (let i = 0; i < 1; i++) {
    addPlayer({ id: i });
}

setInterval(() => {
    let state = gameLoop();
    if (state.players[0].charging === null) {
        togglePlayerCharging(state.players[0].id);
    }
    console.log(state.players);
}, 50);