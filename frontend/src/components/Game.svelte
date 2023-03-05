<script>
    import { gameState, user } from "../stores";
    import socket from "../socket";
    import DeathScreen from "./DeathScreen.svelte";
    import Leaderboard from "./Leaderboard.svelte";
    import Instructions from "./Instructions.svelte";
    $: radius = $gameState?.playerData?.radius;
    const keydown = () => socket.emit("keydown");
    const keyup = () => socket.emit("keyup");
</script>

<main>
    {#if $gameState}
        <svg viewBox={`0 0 ${$gameState.map.width} ${$gameState.map.height}`}>
                {#each Object.entries($gameState.players) as [id, player]}
                    {#if !player.dead}
                        <g transform={`translate(${player.location.x}, ${player.location.y})`}>
                            {#if id == $user.id}
                                <circle r={radius + 1} fill="#ffb2ee"/>
                            {/if}
                            <image 
                                x={-radius} 
                                y={-radius} 
                                xlink:href={player.pfp} 
                                width={2 * radius}
                                height={2 * radius}
                            />
                        </g>
                    {/if}
                {/each}
        </svg>
    {/if}
    <DeathScreen/>
    <Leaderboard/>
    <Instructions/>
</main>

<svelte:window on:keydown={keydown} on:keyup={keyup} on:mousedown={keydown} on:mouseup={keyup}/>

<style>
    main {
        width: 100vw;
        height: 100vh;
        display: flex;
        justify-content: center;
        justify-items: center;
    }
    svg {
        width: 100vmin;
        height: 100vmin;
    }
</style>