<script>
    import Instructions from "./Instructions.svelte";
    import Leaderboard from "./Leaderboard.svelte";
    import Game from "./Game.svelte";
    import DeathOverlay from "./DeathOverlay.svelte";

</script>

<main>
    <Instructions/>
    <Game/>
    <Leaderboard/>
    <DeathOverlay/>
</main>

<style>
    main {
        display: flex;
        justify-content: center;
    }
</style>