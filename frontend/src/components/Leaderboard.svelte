<script>
    import { gameState, user } from "../stores";
    $: leaderboard = $gameState ? Object.values($gameState.players).sort((a, b) => a.score < b.score ? 1 : -1) : [];
</script>

<main>
    <h1>Leaderboard</h1>
    <table>
        <tr><th>Player</th><th>Score</th></tr>
        {#each leaderboard as player}
            {#if !player.dead}
                <tr class={player.id == $user.id ? 'highlighted' : ''}>
                    <th>{player.name}</th><th>{Math.round(player.score * 10) / 10}</th>
                </tr>
            {/if}
        {/each}
    </table>
</main>

<style>
    main {
        display: inline-block;
        width: 25vw;
        max-height: 100vh;
        padding: 2rem;
        overflow: scroll;
    }
    .highlighted {
        background-color: rgba(255, 255, 255, 0.3);
    }
</style>