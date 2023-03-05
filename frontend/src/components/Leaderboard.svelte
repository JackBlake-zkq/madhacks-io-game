<script>
    import { gameState, user } from "../stores";
    $: leaderboard = $gameState ? Object.values($gameState.players).sort((a, b) => a.score < b.score ? 1 : -1) : [];
</script>

<main>
    <div>
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
    </div>
</main>

<style>
    main {
        width: 20vw;
        position: relative;
        height: 100vh;
    }
    div {
        width: 20vw;
        height: 50vw;
        padding: 2rem;
        position: absolute;
        top: 50%; 
        transform: translateY(-50%);
        overflow-y: scroll;
    }
    .highlighted {
        background-color: rgba(255, 255, 255, 0.3);
    }
    h1 {
        text-align: center;
    }
</style>