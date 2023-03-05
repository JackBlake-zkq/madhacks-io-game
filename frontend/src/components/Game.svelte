<script>
    import { gameState, user } from "../stores";
    import socket from "../socket";
    // $: userPos = $gameState.players[$user.id].location
    // let height;
    // let width;
    // $: viewPortWidth = $gameState.playerData.radius * 30;
    // $: viewPortHeight = viewPortWidth * (height / width);
    $: radius = $gameState?.playerData?.radius;
</script>

<!-- bind:clientHeight={height} bind:clientWidth={width} -->
<main>
    {#if $gameState}
        <svg viewBox={`0 0 ${$gameState.map.width} ${$gameState.map.height}`}>
            <!-- <g transform={`translate(${userPos.x / 2 + viewPortWidth / 2}, ${userPos.y / 2 + viewPortHeight / 2})`}>  -->
                {#each Object.entries($gameState.players) as [id, player]}
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
                {/each}
            <!-- </g> -->
        </svg>
    {/if}
</main>

<svelte:window on:keydown={() => socket.emit("keydown")} on:keyup={() => socket.emit("keyup")}/>

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