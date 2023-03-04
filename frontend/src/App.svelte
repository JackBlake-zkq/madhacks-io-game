<script>
    import Game from "./components/Game.svelte";
    import Login from "./components/Login.svelte";
    import { user } from "./stores"
</script>

<main>
    {#if !$user}
        <Login/>
    {:else}
        <Game/>
    {/if}
</main>

<style>
    main {
        width: 100%;
        height: 100%;
    }
</style>