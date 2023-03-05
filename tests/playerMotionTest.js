const { gameLoop, addPlayer, removePlayer, togglePlayerCharging } = require("../gameLogic");

for (let i = 0; i < 100; i++) {
    addPlayer({ id: i });
}

setInterval(() => {
    let state = gameLoop();
    console.log(state.players);
}, 50);