<script>
    import socket from '../socket';
    import { loginError } from "../stores";
    let username = "";
    let pass = "";
    function login() {
        socket.emit("login", {username, pass});
    }
</script>

{#if $loginError}
    <div class="alert">
        {$loginError}
    </div>
{/if}
<main >
    <h1>R<img src="roblox.svg" alt="Roblox Logo" class="roblox"/>BUG<img src="bug.svg" alt="Bug Icon"/></h1>
    <p class = "center">If you want to use your roblox avatar, enter your roblox username!</p>
    <p class = "center">Otherwise, enter any user name:</p>
    <div class="flexCenter">
        <div>
            <input 
                bind:value={username} 
                on:keypress={e => { if(e.keyCode == 13) login() }}
                placeholder="username" type="username"
            />
            <button on:click={login}>Play</button>
        </div>
    </div>
</main>

<style>
    .flexCenter {
        display: flex;
        justify-content: center;
    }
    .roblox {
        margin-left: -1rem;
        margin-right: -1rem;
    }
    h1 {
        text-align: center;
        font-size: 10rem;
        font-family: Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;
        display: block;
    }
    p {
        display: block;
        text-align: center;
    }
    img {
        width: 10rem;
        height: 10rem;
    }
    input[type="username"]{
        display: block;
        height: 3rem;
        width: 20rem;
        border: none;
        border-radius: 0.5rem;
        text-align: center;
        color: var(--text-dark);
        background-color: rgba(255, 255, 255, 0.5);
        margin-top: 1rem;
    }
    button {
        display:block;
        height: 2rem;
        width: 20rem;
        background-color: rgba(255, 255, 255, 0.8);
        border: none;
        border-radius: 0.5rem;
        filter: brightness(.85);
        color: var(--text-dark);
        margin-top: 1rem;
    }
    button:hover {
        background-color: rgba(255, 255, 255, 0.9);
        cursor: pointer;
    }
    .alert {
        padding: 1.5rem;
        background-color: #950a00;
        color: rgb(255, 237, 237);
        margin-bottom: 1rem;
        position: absolute;
        left: 0;
        top: 0;
        width: 100vw;
    }

</style>