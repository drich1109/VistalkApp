<script lang="ts">
    import { redirectIfLoggedIn } from '$lib/shortcuts';
    import { onMount } from 'svelte';
    import AddItem from './AddItem.svelte';
    import type { BackgroundMusic, CoinBag, PowerUp } from './type';

    let openModal:boolean = false;
    let isAdd:boolean = false;

    let powerUp: PowerUp = {
        itemID: 0,
        itemTypeID: 0,
        vcoinPrice: 0,
        isPremium: false,
        name: '',
        description: '',
        filePath: '',
        file: null
    };

    let backgroundMusic: BackgroundMusic = {
        itemID: 0,
        itemTypeID: 0,
        vcoinPrice: 0,
        isPremium: false,
        musicTitle: '',
        musicGenre: '',
        filePath: '',
        file: null
    };

    let coinBag: CoinBag = {
        coinBagId: 0,
        quantity: 0,
        moneyPrice: 0,
        coinBagName: ''
    };


    onMount(async () => {
        await redirectIfLoggedIn(''); // Redirect to login if not logged in
    });

    function modalOpen()
    {
        openModal = true;
        isAdd = true;
    }
    function modalClose()
    {
        openModal =false;
    }
</script>

{#if openModal == true}
    <AddItem modelOpen={openModal} {isAdd} {coinBag} {backgroundMusic} {powerUp} on:close={modalClose}> </AddItem>
{/if}
<div class="flex justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg">
    <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">Item List</p>
    <div class="flex-grow flex justify-center">
        <div class="flex items-center border border-[#B9B9B9] rounded-xl px-12 py-1 bg-white">
            <input type="text" placeholder="Search" class="outline-none text-gray-600 placeholder-[#99BC85]">
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" class="text-[#99BC85]" width="1.5em" height="1.5em" viewBox="0 0 12 12" fill="none">
                    <path d="M8.46342 8.52L10.2 10.2M5.69999 3.6C6.6941 3.6 7.49999 4.40589 7.49999 5.4M9.63999 5.72C9.63999 7.88496 7.88494 9.64 5.71999 9.64C3.55503 9.64 1.79999 7.88496 1.79999 5.72C1.79999 3.55505 3.55503 1.8 5.71999 1.8C7.88494 1.8 9.63999 3.55505 9.63999 5.72Z" stroke="#99BC85" stroke-linecap="round"/>
                </svg> 
            </button>
        </div>
    </div>
    <div class="flex gap-4">
        <button class="font-['Helvetica'] bg-[#99BC85] text-white py-2 px-3 rounded-xl text-sm shadow-lg hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
            View Transaction
        </button>
        <button on:click={modalOpen} class="flex items-center font-['Helvetica'] bg-[#99BC85] text-white py-2 px-3 rounded-xl text-sm shadow-lg hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="text-white mr-2" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M13 6.5V11h4.5v2H13v4.5h-2V13H6.5v-2H11V6.5z"/></svg>
            Add Item
        </button>
    </div>
</div>

<div class="flex mt-6">
    <table class="bg-white w-full shadow-lg rounded-xl">
        <thead class="font-['Cambria'] bg-[#99BC85] text-white text-center">
            <tr class="first:rounded-t-xl last:rounded-b-xl">
                <th class="px-4 py-2 first:rounded-tl-xl last:rounded-tr-xl">Name</th>
                <th class="px-4 py-2">Image</th>
                <th class="px-4 py-2">Description</th>
                <th class="px-4 py-2 first:rounded-tl-xl last:rounded-tr-xl">Cost</th>
                <th class="px-4 py-2 first:rounded-tl-xl last:rounded-tr-xl">Actions</th>
            </tr>
        </thead>
        <tbody class="text-center text-sm">
            <tr class="border-t-2 mx-4">
                <td class="px-4 py-2">Aldrich A. Batisla-on</td>
                <td class="px-4 py-2">aldrichbatislaon@gmail.com</td>
                <td class="px-4 py-2">100000</td>
                <td class="px-4 py-2">hquieywuiyeiuqwyeuqw</td>
                <td class="px-4 py-2 flex justify-center items-center">
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1"/></svg>
                    </button>
                </td>
            </tr>
        </tbody>
    </table>
    
        </div>
        <div class="fixed bottom-0 right-0 flex justify-center items-center bg-white rounded-xl py-2 px-4 shadow-lg ml-4 mr-4 mb-4" style="left: 80px;">
            <div class="flex items-center">
                <button class="bg-[#99BC85] text-white p-2 rounded-lg shadow-sm hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="none" stroke="#fff" stroke-width="2" d="M17 2L7 12l10 10"/>
                    </svg>
                </button>
                <p class="text-[#99BC85] text-center text-sm mx-4">
                    Page 1 of 2
                </p>
                <button class="bg-[#99BC85] text-white p-2 rounded-lg shadow-sm hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                        <path fill="none" stroke="#fff" stroke-width="2" d="m7 2l10 10L7 22"/>
                    </svg>
                </button>
            </div>
        </div>
    <style>
        tbody tr:hover{
            background-color: #e0e0e0;
        }
    </style>