<script lang='ts'>
  import { createEventDispatcher } from "svelte";
  import { login } from "./repo";
  import type { CallResultDto, LoggedInUser } from "../types/types";
  import { saveTokenToLocalStorage, saveUserToLocalStorage } from "$lib/auth/oidcService";
    import MessageBox from "$lib/components/MessageBox.svelte";
    import { initAuth } from "$lib/auth/auth";

  const dispatch = createEventDispatcher();

  async function handleClose() {
      dispatch('close');
  };

  let userName: string = "";
  let password: string = "";
  let userCallResult: CallResultDto<LoggedInUser>;
  let user:LoggedInUser;
  let showMessage:boolean = false;

  async function clickLogIn() {
    showMessage = false;
      try {
        userCallResult = await login(userName, password);
        user = userCallResult.data;
        showMessage = !userCallResult.isSuccess;
        if(userCallResult.isSuccess == true){
          saveTokenToLocalStorage(user.token);
          saveUserToLocalStorage(user);
          dispatch('login', { user });
          handleClose();
        }
        
      } catch (error) {
          console.error("Login failed:", error);
      }
  }

  function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Enter") {
          clickLogIn();
      }
  }
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
  <!-- Modal background -->
  <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div class="modal-background h-[35em] w-[62em] mt-16 relative" on:keydown={handleKeyDown} tabindex={0}>
      <!-- Close button -->
      <button class="absolute top-4 right-4 z-20" on:click={handleClose}>
          <svg class="text-white" xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 24 24">
              <path fill="currentColor" fill-rule="evenodd" d="M6.793 6.793a1 1 0 0 1 1.414 0L12 10.586l3.793-3.793a1 1 0 1 1 1.414 1.414L13.414 12l3.793 3.793a1 1 0 0 1-1.414 1.414L12 13.414l-3.793 3.793a1 1 0 0 1-1.414-1.414L10.586 12L6.793 8.207a1 1 0 0 1 0-1.414" clip-rule="evenodd"/>
          </svg>
      </button>

      <!-- Modal content -->
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10">
          <img class="logo" src="logo-white.png" alt="">
        {#if showMessage == true}
          <MessageBox isDanger = {!userCallResult.isSuccess} message = {userCallResult.message} title={"Error"}></MessageBox>
        {/if}
          <div class="flex items-center border border-white rounded-lg px-2 py-1 gap-2">
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.6011 17.5363V15.8738C17.6011 14.992 17.2486 14.1462 16.621 13.5227C15.9935 12.8991 15.1424 12.5488 14.2549 12.5488H7.56251C6.67504 12.5488 5.82392 12.8991 5.19639 13.5227C4.56885 14.1462 4.21631 14.992 4.21631 15.8738V17.5363" stroke="#0D0D0D" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10.9087 9.22367C12.7568 9.22367 14.2549 7.73503 14.2549 5.8987C14.2549 4.06237 12.7568 2.57373 10.9087 2.57373C9.06065 2.57373 7.5625 4.06237 7.5625 5.8987C7.5625 7.73503 9.06065 9.22367 10.9087 9.22367Z" stroke="#0D0D0D" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>              
              <input class="bg-transparent outline-none text-[#000000] placeholder-white placeholder-opacity-100 pr-2" type="text" placeholder="Enter Username" bind:value={userName}>
          </div>

          <div class="flex items-center border border-white rounded-lg px-2 py-1 gap-2">
              <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.7632 10.0566H5.05152C4.12749 10.0566 3.37842 10.801 3.37842 11.7191V17.5378C3.37842 18.456 4.12749 19.2003 5.05152 19.2003H16.7632C17.6873 19.2003 18.4363 18.456 18.4363 17.5378V11.7191C18.4363 10.801 17.6873 10.0566 16.7632 10.0566Z" stroke="#252121" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M6.72461 10.0569V6.73189C6.72461 5.6296 7.16529 4.57245 7.94971 3.79301C8.73413 3.01357 9.79803 2.57568 10.9074 2.57568C12.0167 2.57568 13.0806 3.01357 13.865 3.79301C14.6494 4.57245 15.0901 5.6296 15.0901 6.73189V10.0569" stroke="#252121" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>              
              <input class="bg-transparent outline-none text-[#000000] placeholder-white placeholder-opacity-100 pr-2" type="password" placeholder="Enter Password" bind:value={password}>
          </div>

          <button type="submit" id="loginBtn" class="bg-white text-lg font-semibold text-[#99BC85] rounded-3xl py-1 px-12" on:click={clickLogIn}>Log In</button>
      </div>
  </div>
</div>

<style>
.modal-background {
    
    background-size: cover;
    background-position: center;
}
.bg-main {
  background-color: #99BC85;
}

.logo {
        width: 120px;
        height: 120px; 
    }
</style>
