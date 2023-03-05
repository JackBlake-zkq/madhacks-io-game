<script>
    import GameScreen from "./components/GameScreen.svelte";
    import Login from "./components/Login.svelte";
    import { user } from "./stores"
</script>

<main>
    {#if !$user}
        <Login/>
    {:else}
        <GameScreen/>
    {/if}
</main>

<style>
    main {
        width: 100%;
        height: 100%;
    }
</style>