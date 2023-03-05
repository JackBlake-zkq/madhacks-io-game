import socket from "./socket";
import { readable, writable } from 'svelte/store';

export const user = writable(null, set => {
    socket.on("loginSuccessful", user => {
        socket.emit("joinGame");
        set(user);
    });

    //test user
    // set({
    //     id: 0,
    //     name: "player0",
    //     location: {
    //         x: 4200,
    //         y: 3200
    //     }
    // });
});

export const gameState = readable(null, set => {
    socket.on("gameTick", game => {
        set(game);
    })

    //test data
    // set({
    //     playerData: {
    //         radius: 10,
    //         startingSpeed: 5,
    //         chargeRadius: 20
    //     },
    //     map: {
    //         width: 100,
    //         height: 100,
    //     },
    //     players: {
    //         0: {
    //             id: 0,
    //             name: "player0",
    //             location: {
    //                 x: 20,
    //                 y: 30
    //             },
    //             pfp: "https://i.imgur.com/2RnSO8r.png"
    //         },
    //         1: {
    //             id: 1,
    //             name: "player1",
    //             location: {
    //                 x: 80,
    //                 y: 50
    //             },
    //             pfp: "https://i.imgur.com/2RnSO8r.png"
    //         }
    //     }
    // })
});