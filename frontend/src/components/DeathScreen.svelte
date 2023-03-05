<script>
    import { gameState, user } from "../stores";
    import socket from "../socket";
    $: dead = !$gameState || $gameState.players[$user.id]?.dead;
</script>

{#if dead}
<main>
    <div class="center">
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
    h1 {
        color: var(--c1);
    }
    button {
        margin:0 auto;
        display:block;
        margin-top: 1rem;
        height:2rem;
        width:100%;
        background-color: var(--c2);
        border: none;
        border-radius: 0.5rem;
        color: rgb(255, 255, 255);
    }
</style>