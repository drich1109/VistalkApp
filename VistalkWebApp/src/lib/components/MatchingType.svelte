<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    
    export let modelOpen: boolean;
    
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
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen px-4 text-center md:items-center sm:block sm:p-0">
        <!-- Overlay -->
        <div 
          on:click={closeModal}
          class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-40" 
          aria-hidden="true"
        ></div>
  
        <!-- Modal -->
        <div 
          class="inline-block w-full max-w-xl p-8 my-20 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl 2xl:max-w-2xl"
          style="opacity: {modelOpen ? 1 : 0}; transform: {modelOpen ? 'translateY(0)' : 'translateY(4rem)'};"
        >
          <div class="flex items-center justify-between space-x-4">
            <h1 class="text-xl font-medium text-gray-800">
              Matching Type
            </h1>
  
            <button 
              on:click={closeModal}
              class="text-gray-600 focus:outline-none hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
              
            <div class="mt-5">
              <label for="question" class="block text-sm text-black capitalize dark:text-black">Question</label>
              <textarea 
                id="question" 
                placeholder="Question" 
                class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40"
              ></textarea>
            </div>
  
            <div class="mt-4">
              <label for="choice1" class="block text-sm text-black capitalize dark:text-black">Choice 1</label>
              <input 
                id="choice1" 
                placeholder="Choice" 
                type="text" 
                class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40"
              />
            </div>
  
            <div class="mt-4">
              <label for="choice2" class="block text-sm text-black capitalize dark:text-black">Choice 2</label>
              <input 
                id="choice2" 
                placeholder="Choice" 
                type="text" 
                class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40"
              />
            </div>
  
            <div class="mt-4">
              <label for="choice3" class="block text-sm text-black capitalize dark:text-black">Choice 3</label>
              <input 
                id="choice3" 
                placeholder="Choice" 
                type="text" 
                class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40"
              />
            </div>
  
            <div class="mt-4">
              <label for="choice4" class="block text-sm text-black capitalize dark:text-black">Choice 4</label>
              <input 
                id="choice4" 
                placeholder="Choice" 
                type="text" 
                class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40"
              />
            </div>
            
            <div class="flex justify-end mt-6">
              <button 
                type="button" 
                class="px-3 py-2 text-sm tracking-wide text-white capitalize transition-colors duration-200 transform bg-black rounded-md dark:bg-black dark:hover:bg-black dark:focus:bg-black hover:bg-black focus:outline-none focus:bg-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
              >
                Save Section
              </button>
            </div>
        </div>
      </div>
    </div>
  {/if}
  