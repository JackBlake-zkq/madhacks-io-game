<script>
    import socket from '../socket';
    let username = "";
    let pass = "";
    function login() {
        socket.emit("login", {username, pass});
    }
</script>

<main>
    <div>
        <h1>Login with Roblox</h1>
        <input bind:value={username} placeholder="username">
        <input bind:value={pass} placeholder="password">
        <button on:click={login}>Login</button>
    </div>
</main>

<style>
    main {
        display: flex;
        justify-content: center;
        justify-items: center;
    }
    input {
        display: block;
        width: 100%;
        text-align: center;
    }
    h1 {
        text-align: center;
    }
</style>