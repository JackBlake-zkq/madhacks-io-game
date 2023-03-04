import socket from "./socket";
import { readable, writable } from 'svelte/store';

export const user = writable(null, set => {
    socket.on("loginSuccesful", (user) => {
        set(user);
    });
})

export const gameState = readable(null, set => {
    socket.on("gameTick", game => {
        set(game);
    })
});