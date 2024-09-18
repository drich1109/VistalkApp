<script lang="ts">
    import { redirectIfLoggedIn } from '$lib/shortcuts';
    import { onMount } from 'svelte';
    import type { UserDto } from './type';
    import { getUserList, getUserPowerUp } from './repo';
    import type { CallResultDto } from '../../types/types';
    import Pagination from '$lib/components/Pagination.svelte';
    import ViewUser from './ViewUser.svelte';

    let userList : UserDto[]=[];
    let pageNo:number =1;
    let searchString:string | null = null;
    let isShowSubscriber:boolean = false;
    let showInactive:boolean = false;
    let openModal: boolean = false;

    let userListCallResult:CallResultDto<UserDto[]> = 
    {
        message: "",
        data: [],
        isSuccess: true,    
        data2: [],
        totalCount: 0
    };

    onMount(async () => {
        await redirectIfLoggedIn('');
        refresh();
    });

    function handlePageChange(event:CustomEvent) {
        const selectElement = event.detail as HTMLSelectElement;
        pageNo = parseInt(selectElement.toString());
        refresh();
    }

    async function refresh()
    {
        userListCallResult = await getUserList(pageNo, searchString, showInactive, isShowSubscriber);
        userList = userListCallResult.data;
    }

    $: {
        if(searchString != null)
            refresh();
    }
    function closeModal() {
        openModal = false;
    }
</script>
{#if openModal == true}
    <ViewUser modelOpen={openModal} on:close={closeModal}></ViewUser>
{/if}
<div class="flex justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg">
    <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">User List</p>
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
    <div class="flex gap-4">
        <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" bind:checked={isShowSubscriber} on:change={refresh}>
            <div class="relative w-11 h-6 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-lime-800"></div>
            <span class="ms-3 text-sm font-medium text-black dark:text-black">Show Subscribers Only</span>
          </label>

          <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" bind:checked={showInactive} on:change={refresh}>
            <div class="relative w-11 h-6 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-lime-800"></div>
            <span class="ms-3 text-sm font-medium text-black dark:text-black">Show Inactive Users</span>
          </label>
    </div>
</div>

<div class="flex mt-6">
    <table class="bg-white w-full shadow-lg rounded-xl">
        <thead class="font-['Cambria'] bg-[#99BC85] text-white  text-center">
            <tr class="first:rounded-t-xl last:rounded-b-xl">
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Email Address</th>
                <th class="px-4 py-2">Vcoins</th>
                <th class="px-4 py-2">Power-ups</th>
                <th class="px-4 py-2">Actions</th>
            </tr>
        </thead>
        <tbody class="text-center text-sm">
            {#if userList != null}
            {#each userList as u}
                <tr class="border-t-2 mx-4">
                    <td class="px-4 py-2">{u.name}</td>
                    <td class="px-4 py-2">{u.email}</td> 
                    <td class="px-4 py-2 flex items-center justify-center">
                        <img src="vcoins.png" alt="Vcoins" class="h-4 w-4 mr-2">
                        {u.vCoin}
                    </td>                 
                    <td class="px-4 py-2">{#each u.powerUps as p}
                        {p.name} - {p.quantity}
                    {/each}</td>
                    <td class="px-4 py-2">
                        <button on:click={() => openModal}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 16 16"><path fill="black" d="M13.5 0h-12C.675 0 0 .675 0 1.5v13c0 .825.675 1.5 1.5 1.5h12c.825 0 1.5-.675 1.5-1.5v-13c0-.825-.675-1.5-1.5-1.5M13 14H2V2h11zM4 9h7v1H4zm0 2h7v1H4zm1-6.5a1.5 1.5 0 1 1 3.001.001A1.5 1.5 0 0 1 5 4.5M7.5 6h-2C4.675 6 4 6.45 4 7v1h5V7c0-.55-.675-1-1.5-1"/></svg>
                        </button> 
                    </td>
            </tr>
            {/each}
            {:else}
            <tr class="border-t-2 mx-4">
                    <td class="px-4 py-2" colspan="6">No Questions Found on Units</td>
                </tr>
            {/if}
        </div>
        {#if userListCallResult.totalCount}
            <Pagination totalCount = {userListCallResult.totalCount} {pageNo} on:handlePageChange={handlePageChange}></Pagination>
        {/if}
        
        
    <style>
        tbody tr:hover{
            background-color: #e0e0e0;
        }
    </style>