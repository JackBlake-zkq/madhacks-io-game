<script>
    import { gameState, user } from "../stores";
    const vNorm = player => Math.sqrt(Math.pow(player.velocity.x, 2) + Math.pow(player.velocity.y, 2));
    $: leaderboard = $gameState ? Object.values($gameState.players).sort((a, b) => vNorm(a) < vNorm(b) ? 1 : -1) : [];
</script>

<main>
    <h1>Leaderboard</h1>
    <table>
        <tr><th>Player</th><th>Velocity</th></tr>
        {#each leaderboard as player}
            {#if !player.dead}
                <tr><th>{player.name}</th><th>{Math.round(vNorm(player) * 10) / 10}</th></tr>
            {/if}
        {/each}
    </table>
</main>

<style>
    main {
        position: absolute;
        right: 0;
        top: 0;
        width: 25vmin;
        padding: 1rem;
        overflow: scroll;
        max-height: 100vh;
    }
</style>