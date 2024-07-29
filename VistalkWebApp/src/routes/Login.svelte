<script lang='ts'>
    import { createEventDispatcher } from "svelte";
    import { login } from "./repo";
    import type { LoggedInUser } from "../types/types";
    const dispatch = createEventDispatcher();

    const handleClose = () => {
    dispatch('close');
    };

    let userName:string = "";
    let password:string = "";
    let user:LoggedInUser;

    async function clickLogIn()
    {
        user = await login(userName, password);
        console.log(user);
    }
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <button on:click={handleClose}>
        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M6.793 6.793a1 1 0 0 1 1.414 0L12 10.586l3.793-3.793a1 1 0 1 1 1.414 1.414L13.414 12l3.793 3.793a1 1 0 0 1-1.414 1.414L12 13.414l-3.793 3.793a1 1 0 0 1-1.414-1.414L10.586 12L6.793 8.207a1 1 0 0 1 0-1.414" clip-rule="evenodd"/></svg>
    </button>
    <div class="bg-white rounded-lg shadow-lg p-4">
      <div class="relative">
        <input type="text" name="" id="" placeholder="Enter Username" bind:value={userName}>
        <input type="text" name="" id="" placeholder="Enter Password"  bind:value={password}>
        <button type="submit" id="loginBtn" class="bg-[#99BC85] hover:bg-black text-white font-bold py-2 px-4 rounded" on:click={clickLogIn}>Log In</button>
      </div>
    </div>
</div>
