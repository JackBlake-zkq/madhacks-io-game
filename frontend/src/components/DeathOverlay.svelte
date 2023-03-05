<script>
    import { gameState, user } from "../stores";
    import socket from "../socket";
    $: dead = !$gameState || $gameState.players[$user.id]?.dead;
</script>

{#if dead}
<main>
    <div>
        <h1>You died!</h1>
        <button on:click={() => socket.emit("joinGame")}>Play Again</button>
    </div>
</main>
{/if}

<style>
    main {
        z-index: 10;
        background: rgba(255, 255, 255, 0.4);
        width: 100vw;
        height: 100vh;
        position: absolute;
        left: 0;
        top: 0;
    }
    main div {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        position: absolute;
    }
    h1 {
        color: var(--text-dark);
    }
    button {
        display:block;
        margin-top: 1rem;
        height:2rem;
        width: 10rem;
        background-color: rgba(0,0,0, 0.3);
        border: none;
        border-radius: 0.5rem;
        color: var(--text-light);
    }
    button:hover {
        background-color: rgba(0,0,0, 0.2);
        cursor: pointer;
    }
</style>