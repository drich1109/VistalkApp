<script lang="ts">
    import { redirectIfLoggedIn } from '$lib/shortcuts';
    import { onMount } from 'svelte';
    import AddItem from './AddItem.svelte';
    import type { BackgroundMusic, CoinBag, ItemType, PowerUp } from './type';
    import { coinBagInactive, getItemFileByFileName, getItemList, getItemType, setItemInactive } from './repo';
    import type { CallResultDto } from '../../types/types';
    import Pagination from '$lib/components/Pagination.svelte';
    import Loader from '$lib/components/Loader.svelte';
  
    let openModal: boolean = false;
    let isAdd: boolean = false;
    let itemTypeID: number = 1;
    let itemTypes: ItemType[] = [];
    let powerUpList: PowerUp[] = [];
    let backgroundMusicList: BackgroundMusic[] = [];
    let coinBagList: CoinBag[] = [];
    let fileUrl: string = "";
  
    let powerUpCallResult: CallResultDto<PowerUp[]> = {
        message: "",
        data: [],
        isSuccess: false,
        data2: [],
        totalCount: 0
    };
  
    let bgCallResult: CallResultDto<BackgroundMusic[]> = {
        message: "",
        data: [],
        isSuccess: false,
        data2: [],
        totalCount: 0
    };
  
    let coinBagCallResult: CallResultDto<CoinBag[]> = {
        message: "",
        data: [],
        isSuccess: false,
        data2: [],
        totalCount: 0
    };
  
    let searchString: string | null = null;
    let pageNo: number = 1;
    let isLoading: boolean = false;
  
    let powerUp: PowerUp = {
        itemID: 0,
        itemTypeID: 0,
        vcoinPrice: 0,
        isPremium: false,
        name: '',
        description: '',
        filePath: '',
        file: null,
        isActive: true
    };
  
    let backgroundMusic: BackgroundMusic = {
        itemID: 0,
        itemTypeID: 0,
        vcoinPrice: 0,
        isPremium: false,
        musicTitle: '',
        musicGenre: '',
        filePath: '',
        file: null,
        isActive: true
    };
  
    let coinBag: CoinBag = {
        coinBagId: 0,
        quantity: 0,
        moneyPrice: 0,
        coinBagName: '',
        isActive: true
    };
  
    onMount(async () => {
        await redirectIfLoggedIn('');
        await refresh();
    });
  
    async function modalOpen(add: boolean, p: PowerUp | null, b: BackgroundMusic | null, c: CoinBag | null) {
        if (p != null) {
            powerUp = p;
            const fileBlob = await getItemFileByFileName(p.filePath, itemTypeID);
            if (fileBlob != null) {
                fileUrl = URL.createObjectURL(fileBlob);
                powerUp.file = new File([fileBlob], powerUp.filePath, { type: fileBlob.type });
            }
        } else if (b != null) {
            backgroundMusic = b;
            const fileBlob = await getItemFileByFileName(b.filePath, itemTypeID);
            if (fileBlob != null) {
                fileUrl = URL.createObjectURL(fileBlob);
                backgroundMusic.file = new File([fileBlob], backgroundMusic.filePath, { type: fileBlob.type });
            }
        } else if (c != null) coinBag = c;
  
        isAdd = add;
        openModal = true;
    }
  
    function modalClose() {
        openModal = false;
        reinitialize();
        refresh();
    }
  
    async function reinitialize() {
        fileUrl = "";
        powerUp = {
            itemID: 0,
            itemTypeID: 0,
            vcoinPrice: 0,
            isPremium: false,
            name: '',
            description: '',
            filePath: '',
            file: null,
            isActive: true
        };
  
        backgroundMusic = {
            itemID: 0,
            itemTypeID: 0,
            vcoinPrice: 0,
            isPremium: false,
            musicTitle: '',
            musicGenre: '',
            filePath: '',
            file: null,
            isActive: true
        };
  
        coinBag = {
            coinBagId: 0,
            quantity: 0,
            moneyPrice: 0,
            coinBagName: '',
            isActive: true
        };
  
        refresh();
    }
  
    async function refresh() {
        isLoading = true; // Set loading state to true
        const itemTypeCallResult = await getItemType();
        itemTypes = itemTypeCallResult.data;
  
        if (itemTypeID === 1) {
            powerUpCallResult = await getItemList(itemTypeID, pageNo, searchString) as CallResultDto<PowerUp[]>;
            powerUpList = powerUpCallResult.data;
        } else if (itemTypeID === 2) {
            bgCallResult = await getItemList(itemTypeID, pageNo, searchString) as CallResultDto<BackgroundMusic[]>;
            backgroundMusicList = bgCallResult.data;
        } else if (itemTypeID === 3) {
            coinBagCallResult = await getItemList(itemTypeID, pageNo, searchString) as CallResultDto<CoinBag[]>;
            coinBagList = coinBagCallResult.data;
        }
        isLoading = false; // Set loading state to false
    }
  
    $: {
        if (searchString != null) refresh();
    }
  
    function handlePageChange(event: CustomEvent) {
        const selectElement = event.detail as HTMLSelectElement;
        pageNo = parseInt(selectElement.toString());
        refresh();
    }
  
    async function itemSetInactive(id: number) {
        await setItemInactive(id);
        refresh();
    }
  
    async function coinBagInactiveSet(id: number) {
        await coinBagInactive(id);
        refresh();
    }
  </script>
  
  {#if isLoading}
    <Loader {isLoading}></Loader>
    {/if}
{#if openModal == true}
    <AddItem modelOpen={openModal} {isAdd} {coinBag} {backgroundMusic} {powerUp} {fileUrl} currentType={itemTypeID} on:close={modalClose} on:refresh={refresh}> </AddItem>
{/if}
<div class="flex flex-col sm:flex-row justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg">
    <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">Item List</p>
    <div class="flex-grow flex justify-center">
        <div class="flex items-center border border-[#B9B9B9] rounded-xl px-12 py-1 bg-white">
            <input type="text" bind:value={searchString} placeholder="Search" class="outline-none text-gray-600 placeholder-[#99BC85]">
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" class="text-[#99BC85]" width="1.5em" height="1.5em" viewBox="0 0 12 12" fill="none">
                    <path d="M8.46342 8.52L10.2 10.2M5.69999 3.6C6.6941 3.6 7.49999 4.40589 7.49999 5.4M9.63999 5.72C9.63999 7.88496 7.88494 9.64 5.71999 9.64C3.55503 9.64 1.79999 7.88496 1.79999 5.72C1.79999 3.55505 3.55503 1.8 5.71999 1.8C7.88494 1.8 9.63999 3.55505 9.63999 5.72Z" stroke="#99BC85" stroke-linecap="round"/>
                </svg> 
            </button>
        </div>
    </div>
    <div class="flex flex-col sm:flex-row gap-4 mt-4 sm:mt-0">
        <select bind:value={itemTypeID} on:change={refresh} class="w-full font-['Helvetica'] bg-white text-black py-2 px-3 rounded-md text-sm border border border-gray-200">
                    {#each itemTypes as item}
                        <option class="py-2" value={item.itemTypeID}>{item.typeName}</option>
                    {/each}
                </select>
        <button on:click={() => modalOpen(true, null , null, null)} class="flex items-center font-['Helvetica'] bg-[#99BC85] text-white py-2 px-3 rounded-xl text-sm shadow-lg hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="text-white mr-2" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M13 6.5V11h4.5v2H13v4.5h-2V13H6.5v-2H11V6.5z"/></svg>
            Add Item
        </button>
    </div>
</div>

    {#if itemTypeID == 1}
    <div class="flex mt-6">
        <table class="bg-white w-full shadow-lg rounded-xl">
            <thead class="font-['Cambria'] bg-[#99BC85] text-white text-center">
                <tr>
                    <th class="px-4 py-2">Name</th>
                    <th class="px-4 py-2">Description</th>
                    <th class="px-4 py-2">Cost</th>
                    <th class="px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody class="text-center text-sm">
                {#each powerUpList as powerUp}
                    <tr>
                        <td class="px-4 py-2">{powerUp.name}</td>
                        <td class="px-4 py-2">{powerUp.description}</td>
                        <td class="px-4 py-2">{powerUp.vcoinPrice}</td>
                        <td class="px-4 py-2">
                            <button on:click={() => modalOpen(false,powerUp, null, null)}><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 16 16"><path fill="black" d="M15.49 7.3h-1.16v6.35H1.67V3.28H8V2H1.67A1.21 1.21 0 0 0 .5 3.28v10.37a1.21 1.21 0 0 0 1.17 1.25h12.66a1.21 1.21 0 0 0 1.17-1.25z"/><path fill="black" d="M10.56 2.87L6.22 7.22l-.44.44l-.08.08l-1.52 3.16a1.08 1.08 0 0 0 1.45 1.45l3.14-1.53l.53-.53l.43-.43l4.34-4.36l.45-.44l.25-.25a2.18 2.18 0 0 0 0-3.08a2.17 2.17 0 0 0-1.53-.63a2.2 2.2 0 0 0-1.54.63l-.7.69l-.45.44zM5.51 11l1.18-2.43l1.25 1.26zm2-3.36l3.9-3.91l1.3 1.31L8.85 9zm5.68-5.31a.9.9 0 0 1 .65.27a.93.93 0 0 1 0 1.31l-.25.24l-1.3-1.3l.25-.25a.88.88 0 0 1 .69-.25z"/></svg></button>
                        
                            <button on:click={() => itemSetInactive(powerUp.itemID)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1"/></svg>
                            </button>                        
                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
    </div>

        {#if powerUpCallResult.totalCount}
        <Pagination totalCount = {powerUpCallResult.totalCount} {pageNo} on:handlePageChange={handlePageChange}></Pagination>
        {/if}

    {:else if itemTypeID == 2}
    <div class="flex mt-6">
        <table class="bg-white w-full shadow-lg rounded-xl" >
            <thead class="font-['Cambria'] bg-[#99BC85] text-white text-center">
                <tr>
                    <th class="px-4 py-2">Title</th>
                    <th class="px-4 py-2">Genre</th>
                    <th class="px-4 py-2">Cost</th>
                    <th class="px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody class="text-center text-sm">
                {#each backgroundMusicList as music}
                    <tr>
                        <td class="px-4 py-2">{music.musicTitle}</td>
                        <td class="px-4 py-2">{music.musicGenre}</td>
                        <td class="px-4 py-2">{music.vcoinPrice}</td>
                        <td class="px-4 py-2">
                            <button on:click={() => modalOpen(false,null, music, null)}><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 16 16"><path fill="black" d="M15.49 7.3h-1.16v6.35H1.67V3.28H8V2H1.67A1.21 1.21 0 0 0 .5 3.28v10.37a1.21 1.21 0 0 0 1.17 1.25h12.66a1.21 1.21 0 0 0 1.17-1.25z"/><path fill="black" d="M10.56 2.87L6.22 7.22l-.44.44l-.08.08l-1.52 3.16a1.08 1.08 0 0 0 1.45 1.45l3.14-1.53l.53-.53l.43-.43l4.34-4.36l.45-.44l.25-.25a2.18 2.18 0 0 0 0-3.08a2.17 2.17 0 0 0-1.53-.63a2.2 2.2 0 0 0-1.54.63l-.7.69l-.45.44zM5.51 11l1.18-2.43l1.25 1.26zm2-3.36l3.9-3.91l1.3 1.31L8.85 9zm5.68-5.31a.9.9 0 0 1 .65.27a.93.93 0 0 1 0 1.31l-.25.24l-1.3-1.3l.25-.25a.88.88 0 0 1 .69-.25z"/></svg></button>
                        
                            <button on:click={() => itemSetInactive(music.itemID)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1"/></svg>
                            </button>                           </td>
                    </tr>
                {/each}
            </tbody>
        </table>
        </div>
        {#if bgCallResult.totalCount}
        <Pagination totalCount = {bgCallResult.totalCount} {pageNo} on:handlePageChange={handlePageChange}></Pagination>
        {/if}
    {:else if itemTypeID == 3}
    <div class="flex mt-6">

        <table class="bg-white w-full shadow-lg rounded-xl">
            <thead class="font-['Cambria'] bg-[#99BC85] text-white text-center">
                <tr>
                    <th class="px-4 py-2">Name</th>
                    <th class="px-4 py-2">Quantity</th>
                    <th class="px-4 py-2">Price</th>
                    <th class="px-4 py-2">Actions</th>
                </tr>
            </thead>
            <tbody class="text-center text-sm">
                {#each coinBagList as coinBag}
                    <tr>
                        <td class="px-4 py-2">{coinBag.coinBagName}</td>
                        <td class="px-4 py-2">{coinBag.quantity}</td>
                        <td class="px-4 py-2">{coinBag.moneyPrice}</td>
                        <td class="px-4 py-2">
                            <button on:click={() => modalOpen(false,null, null, coinBag)}><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 16 16"><path fill="black" d="M15.49 7.3h-1.16v6.35H1.67V3.28H8V2H1.67A1.21 1.21 0 0 0 .5 3.28v10.37a1.21 1.21 0 0 0 1.17 1.25h12.66a1.21 1.21 0 0 0 1.17-1.25z"/><path fill="black" d="M10.56 2.87L6.22 7.22l-.44.44l-.08.08l-1.52 3.16a1.08 1.08 0 0 0 1.45 1.45l3.14-1.53l.53-.53l.43-.43l4.34-4.36l.45-.44l.25-.25a2.18 2.18 0 0 0 0-3.08a2.17 2.17 0 0 0-1.53-.63a2.2 2.2 0 0 0-1.54.63l-.7.69l-.45.44zM5.51 11l1.18-2.43l1.25 1.26zm2-3.36l3.9-3.91l1.3 1.31L8.85 9zm5.68-5.31a.9.9 0 0 1 .65.27a.93.93 0 0 1 0 1.31l-.25.24l-1.3-1.3l.25-.25a.88.88 0 0 1 .69-.25z"/></svg></button>
                        
                            <button on:click={() => coinBagInactiveSet(coinBag.coinBagId)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1"/></svg>
                            </button>                        </td>
                    </tr>
                {/each}
            </tbody>
        </table>
        </div>
        {#if coinBagCallResult.totalCount}
        <Pagination totalCount = {coinBagCallResult.totalCount} {pageNo} on:handlePageChange={handlePageChange}></Pagination>
        {/if}
        {/if}
    
    <style>
        tbody tr:hover{
            background-color: #e0e0e0;
        }
    </style>