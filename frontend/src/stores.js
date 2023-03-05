import socket from "./socket";
import { readable, writable } from 'svelte/store';

export const user = writable(null, set => {
    socket.on("loginSuccessful", user => {
        console.log(user);
        set(user);
    });
});

export const gameState = readable(null, set => {
    socket.on("gameTick", game => {
        set(game);
    })
});