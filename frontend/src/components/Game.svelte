<script>
    import { gameState, user } from "../stores";
    import socket from "../socket";
    $: radius = $gameState?.playerData?.radius;
    const keydown = () => socket.emit("keydown");
    const keyup = () => socket.emit("keyup");
    let down = false;
    $: {
        if(down) keydown();
        else keyup();
    }
</script>

<main>
    <div>
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
    </div>
</main>

<svelte:window 
    on:keydown={() => down = true} 
    on:keyup={() => down = false} 
    on:mousedown={() => down = true} 
    on:mouseup={() => down = false}
/>

<style>
    main {
        width: 50vw;
        height: 100vh;
        display: inline-block;
    }
    div {
        display: flex;
        justify-items: center;
        width: 100%;
        height: 100%;
    }
    svg {
        width: 50vw;
        height: 50vw;
        background-color: var(--lbg);
    }
</style>