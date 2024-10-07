<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { UserDto } from "./type";

    export let modelOpen: boolean;
    export let userView:UserDto;

    const dispatch = createEventDispatcher();

    function closeModal() {
    dispatch('close');
  }

</script>

{#if modelOpen}
    <div 
      class="fixed inset-0 z-50 overflow-y-auto" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true">
      
      <div class="flex items-end justify-center mt-24 px-4 text-center md:items-center sm:block sm:p-0">
        
        <div 
          on:click={closeModal}
          class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-40" 
          aria-hidden="true"
        ></div>
  
        <div 
          class="inline-block w-full max-w-xl p-8 my-20 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl 2xl:max-w-2xl"
          style="opacity: {modelOpen ? 1 : 0}; transform: {modelOpen ? 'translateY(0)' : 'translateY(4rem)'};"
        >
  
            <button 
            on:click={closeModal}
              class="text-gray-600 focus:outline-none hover:text-gray-700 justify-end">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
  
          <form class="mt-5">
            <div class="mt-2">
                <label for="username" class="block text-sm text-black dark:text-black">{userView.name}</label>
            </div>
            <div class="mt-2">
                <label for="username" class="block text-sm text-black dark:text-black">{userView.email}</label>
            </div>
          </form>
        </div>
      </div>
    </div>
  {/if}
