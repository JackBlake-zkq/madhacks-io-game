<script>
    import socket from '../socket';
    import { loginError } from "../stores";
    let username = "";
    let pass = "";
    function login() {
        socket.emit("login", {username, pass});
    }
</script>

<main >
    {#if $loginError}
        <div class="alert">
            {$loginError}
        </div>
    {/if}
    <h1 >(Name)</h1>
    <p class = "center">If you want to use your roblox avatar enter your roblox username!</p>
        <div class = "center" >
            <input bind:value={username} placeholder="username" type = "username">
            <!--<input bind:value={pass} placeholder="password"> -->
            <button on:click={login}>Login</button>
        </div>
</main>

<style>
    *{
        box-sizing: border-box;
    }
    input {
        display: block;
        height: 3rem;
        width: 300px;
        text-align: center;
        background-color: var(--bg);
        filter: brightness(3);
        border: none;
        border-radius: 0.5rem;
        margin-top: 8rem;
    }
    input[type="username"]{
        color:rgb(146, 146, 146);
    }
    h1 {
        text-align: center;
        margin-top: 7rem;
        font-size: 50px;
    }
    button{
        margin:0 auto;
        display:block;
        margin-top: 1rem;
        height:2rem;
        width:40%;
        background-color: var(--c2);
        border: none;
        border-radius: 0.5rem;
        filter: brightness(.85);
        color: rgb(255, 255, 255);
    }
    ::selection {
        color: #ffb2ee;
        background:transparent
    }
    /* The alert message box */
.alert {
  padding: 20px;
  background-color: #f44336; /* Red */
  color: white;
  margin-bottom: 15px;
}

</style>