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
    {#if $gameState}
        <svg viewBox={`0 0 ${$gameState.map.width} ${$gameState.map.height}`}>
                {#each Object.entries($gameState.players) as [id, player]}
                    {#if !player.dead}
                        <g transform={`translate(${player.location.x}, ${player.location.y})`}>
                            {#if id == $user.id}
                                <circle r={radius * 1.2} fill="green"/>
                            {/if}
                            <circle r={radius} fill="gray"/>
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
        position: relative;
    }
    svg {
        width: 50vw;
        height: 50vw;
        background-color: var(--lbg);
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
</style>