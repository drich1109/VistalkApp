<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { redirectIfLoggedIn } from '$lib/shortcuts';
  import type { CallResultDto  } from "../../types/types";
  import type { BackgroundMusic, CoinBag, ItemType, PowerUp } from './type';
  import { getItemType, saveBackgroundMusic, saveCoinbag, savePowerup } from './repo';
  
  export let modelOpen:boolean;
  export let isAdd:boolean;
  export let coinBag:CoinBag;
  export let backgroundMusic:BackgroundMusic;
  export let powerUp:PowerUp;

  let itemTypes: ItemType[] = [];
  let currentType: number = 1;
  let fileUrl:string;

  function handleFile(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      fileUrl = URL.createObjectURL(file);
      console.log(fileUrl);
      powerUp.filePath = file.name;
      powerUp.file = file;
    }
  }

  function handleFileAudio(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];

    if (file) {
      fileUrl = URL.createObjectURL(file);
      console.log(fileUrl);
      backgroundMusic.filePath = file.name;
      backgroundMusic.file = file;
    }
  }

  const dispatch = createEventDispatcher();
  onMount(async () => {
    await redirectIfLoggedIn(''); 
    const itemTypeCallResult = await getItemType();
    itemTypes  = itemTypeCallResult.data;
    console.log(itemTypes);
  });

  function closeModal() {
    resetModalData(); // Reset modal data when closing
    dispatch('close');
  }

  function resetModalData() {
    powerUp.file = null;
    powerUp.filePath = '';
    backgroundMusic.file = null;
    backgroundMusic.filePath = '';
    fileUrl = '';
  }

  async function saveItem() {
    if(currentType == 1) {
      powerUp.itemTypeID = currentType;
      const result = await savePowerup(powerUp);
    }
    else if(currentType == 2) {
      backgroundMusic.itemTypeID = currentType;
      const result = await saveBackgroundMusic(backgroundMusic);
  }
  else if(currentType == 3) {
      const result = await saveCoinbag(coinBag,currentType);
  }
}
</script>
  
  {#if modelOpen}
    <div 
      class="fixed inset-0 z-50 overflow-y-auto" 
      aria-labelledby="modal-title" 
      role="dialog" 
      aria-modal="true">
      
      <div class="flex items-end justify-center min-h-screen px-4 text-center md:items-center sm:block sm:p-0">
        
        <div 
          on:click={closeModal}
          class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-40" 
          aria-hidden="true"
        ></div>
  
        <div 
          class="inline-block w-full max-w-xl p-8 my-20 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl 2xl:max-w-2xl"
          style="opacity: {modelOpen ? 1 : 0}; transform: {modelOpen ? 'translateY(0)' : 'translateY(4rem)'};"
        >
          <div class="flex items-center justify-between space-x-4">
            <h1 class="text-xl font-medium text-gray-800">{isAdd ? "Create Item" : "Edit Item"}</h1>
  
            <button 
            on:click={closeModal}
              class="text-gray-600 focus:outline-none hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
  
          <form class="mt-5">
            <div>
                <select bind:value={currentType} name="" id="" class="w-full font-['Helvetica'] bg-white text-black py-2 px-3 rounded-md text-sm border border border-gray-200">
                    <option class="py-2" value={0}>--Select Item Type--</option>
                    {#each itemTypes as item}
                        <option class="py-2" value={item.itemTypeID}>{item.typeName}</option>
                    {/each}
                </select>
              </div>
              {#if currentType == 1}
              <div class="mt-2">
                <label for="username" class="block text-sm text-black capitalize dark:text-black">Power Up Name</label>
                <input bind:value={powerUp.name} placeholder="Powerup Name" type="text" class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40">
            </div>

            <div class="mt-2">
                <label for="username" class="block text-sm text-black capitalize dark:text-black">Item Description</label>
                <input bind:value={powerUp.description}   placeholder="Powerup Description" type="text" class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40">
            </div>

              <div class="mt-2">
                <label for="username" class="block text-sm text-black capitalize dark:text-black">VCoin Price</label>
              <input bind:value={powerUp.vcoinPrice}  placeholder="Powerup Price" type="number" class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40">
            </div>

            <div class="mt-2">  
                <label class="inline-flex items-center cursor-pointer">
                    <input bind:checked={powerUp.isPremium}  type="checkbox" class="sr-only peer">
                    <div class="relative w-11 h-6 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-lime-800"></div>
                    <span class="ms-3 text-sm font-medium text-black dark:text-black">Premium Item</span>
                  </label>
            </div>

            <div class="mt-2">
                <div class="flex">
                    <label for="powerUpFile" class="bg-black p-2 text-white text-sm rounded-md flex items-justify mr-2 cursor-pointer" >Upload file<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/></svg></label>
                    <input on:change={(event) => handleFile(event)} id="powerUpFile"
                        type="file" class="file-input" accept=".png"style="visibility: hidden"/>
                </div>
                {#if powerUp.file}
                <div class="mt-2">
                    <img src={fileUrl} alt="Uploaded Image" class="mt-2 max-w-xs rounded-md"/>
                    <p>{powerUp.file.name}</p>
                </div>
            {/if}
            </div>
            {/if}
            {#if currentType == 2}
            <div class="mt-2">
                <label for="username" class="block text-sm text-black capitalize dark:text-black">Music Name</label>
              <input bind:value={backgroundMusic.musicTitle}  placeholder="Music Name" type="text" class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40">
            </div>

            <div class="mt-2">
                <label for="username" class="block text-sm text-black capitalize dark:text-black">Music Genre</label>
              <input bind:value={backgroundMusic.musicGenre} placeholder="Music Genre" type="text" class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40">
            </div>

            <div class="mt-2">
              <label for="username" class="block text-sm text-black capitalize dark:text-black">Music Price</label>
            <input bind:value={backgroundMusic.vcoinPrice} placeholder="Music Price" type="text" class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40">
          </div>

          <div class="mt-2">  
              <label class="inline-flex items-center cursor-pointer">
                  <input bind:checked={backgroundMusic.isPremium} type="checkbox" class="sr-only peer">
                  <div class="relative w-11 h-6 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-lime-800"></div>
                  <span class="ms-3 text-sm font-medium text-black dark:text-black">Premium Item</span>
                </label>
          </div>

          <div class="mt-2">
              <div class="flex">
                  <label class="bg-black p-2 text-white text-sm rounded-md flex items-justify mr-2 cursor-pointer" for="file2">Upload file<svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/></svg></label>
                  <input type="file" class="file-input" on:change={(event) => handleFileAudio(event)} accept=".mp3"style="visibility: hidden" id="file2"/>
              </div>
              {#if backgroundMusic.file}
            <div class="mt-2">
              <audio controls class="mt-2 max-w-xs rounded-md">
                  <source src={fileUrl} type={backgroundMusic.file.type}>
                  Your browser does not support the audio element.
              </audio>
              <p>{backgroundMusic.file.name}</p>
          </div>
      {/if}
          </div>
          {/if}

          {#if currentType == 3}
            <div class="mt-2">
                <label for="username" class="block text-sm text-black capitalize dark:text-black">Coin Bag Name</label>
                <input bind:value={coinBag.coinBagName}  placeholder="Coinbag Name" type="text" class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40">
            </div>

            <div class="mt-2">
                <label for="username" class="block text-sm text-black capitalize dark:text-black">Quantity</label>
                <input bind:value={coinBag.quantity} placeholder="Coinbag Quantity" type="number" class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40">
            </div>

            <div class="mt-2">
                <label for="username" class="block text-sm text-black capitalize dark:text-black">Price</label>
            <input bind:value={coinBag.moneyPrice} placeholder="Coinbag Price" type="number" class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40">
            </div>
        {/if}
            <div class="flex justify-end mt-6">
              <button on:click={saveItem} type="button" class="px-3 py-2 text-sm tracking-wide text-white capitalize transition-colors duration-200 transform bg-black rounded-md dark:bg-black dark:hover:bg-black dark:focus:bg-black hover:bg-black focus:outline-none focus:bg-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50">
                Save Item
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  {/if}
  