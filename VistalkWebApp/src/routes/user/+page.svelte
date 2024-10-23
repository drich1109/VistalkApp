<script lang="ts">
    import { redirectIfLoggedIn } from '$lib/shortcuts';
    import { onMount } from 'svelte';
    import type { PowerUpDto, UserDto } from './type';
    import { getUserList, getUserPowerUp } from './repo';
    import type { CallResultDto } from '../../types/types';
    import Pagination from '$lib/components/Pagination.svelte';
    import ViewUser from './ViewUser.svelte';
    import { getItemFileByFileName } from '../shop/repo';

    let userList: UserDto[] = [];
    let pageNo: number = 1;
    let searchString: string | null = null;
    let isShowSubscriber: boolean = false;
    let showInactive: boolean = false;
    let openModal: boolean = false;
    let userView: UserDto;
    // Change powerUpUrls to a dictionary to hold ID-URL pairs
    let powerUpUrls: Record<number, string> = {};
    let powerUps: PowerUpDto[] = [];

    let userListCallResult: CallResultDto<UserDto[]> = {
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

    function handlePageChange(event: CustomEvent) {
        const selectElement = event.detail as HTMLSelectElement;
        pageNo = parseInt(selectElement.toString());
        refresh();
    }

    async function refresh() {
        userListCallResult = await getUserList(pageNo, searchString, showInactive, isShowSubscriber);
        userList = userListCallResult.data;
        powerUps = userList[0]?.powerUps || [];

        const filePromises = powerUps.map(async (powerUp) => {
            const fileBlob = await getItemFileByFileName(powerUp.filePath, 1);
            const newFile = new Blob();
            const imageUrl = URL.createObjectURL(fileBlob || newFile);
            powerUpUrls[powerUp.itemId] = imageUrl;
        });

        await Promise.all(filePromises);
    }

    $: {
        if (searchString != null)
            refresh();
    }

    function closeModal() {
        openModal = false;
    }

    async function openViewModal(u: UserDto) {
        userView = u;
        openModal = true;
    }
</script>

{#if openModal == true}
    <ViewUser modelOpen={openModal} {userView} on:close={closeModal}></ViewUser>
{/if}

<div class="gap-4 flex flex-col sm:flex-row justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg">
    <p class="font-['Helvetica'] text-black text-xl font-bold">User List</p>
    <div class="flex-grow flex justify-center">
        <div class="flex items-center border border-[#6addd0] rounded-xl px-12 py-1 bg-white">
            <input type="text" bind:value={searchString} placeholder="Search" class="outline-none text-gray-600 placeholder-gray">
            <button>
                <svg xmlns="http://www.w3.org/2000/svg" class="text-[#f7c188]" width="1.5em" height="1.5em" viewBox="0 0 12 12" fill="none">
                    <path d="M8.46342 8.52L10.2 10.2M5.69999 3.6C6.6941 3.6 7.49999 4.40589 7.49999 5.4M9.63999 5.72C9.63999 7.88496 7.88494 9.64 5.71999 9.64C3.55503 9.64 1.79999 7.88496 1.79999 5.72C1.79999 3.55505 3.55503 1.8 5.71999 1.8C7.88494 1.8 9.63999 3.55505 9.63999 5.72Z" stroke="#f7c188" stroke-linecap="round"/>
                </svg> 
            </button>
        </div>
    </div>
    <div class="flex gap-4">
        <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" bind:checked={isShowSubscriber} on:change={refresh}>
            <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 
                peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                after:start-[2px] after:bg-white after:border-gray-300 after:border 
                after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 
                peer-checked:bg-gradient-to-r peer-checked:from-[#6addd0] peer-checked:to-[#f7c188]">
            </div>
            <span class="ms-3 text-sm font-medium text-black dark:text-black">Show Subscribers Only</span>
        </label>

        <label class="inline-flex items-center cursor-pointer">
            <input type="checkbox" class="sr-only peer" bind:checked={showInactive} on:change={refresh}>
            <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 
                peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full 
                peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] 
                after:start-[2px] after:bg-white after:border-gray-300 after:border 
                after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 
                peer-checked:bg-gradient-to-r peer-checked:from-[#6addd0] peer-checked:to-[#f7c188]">
            </div>
            <span class="ms-3 text-sm font-medium text-black dark:text-black">Show Inactive Users</span>
        </label>
    </div>
</div>

<div class="mt-6 overflow-x-auto">
    <table class="bg-white w-full shadow-lg rounded-xl min-w-[640px]">
        <thead class="font-['Cambria'] bg-gradient-to-r from-[#6addd0] to-[#f7c188] text-white text-center">
            <tr class="first:rounded-t-xl last:rounded-b-xl">
                <th class="px-4 py-2 first:rounded-tl-xl last:rounded-tr-xl">Name</th>
                <th class="px-4 py-2">Email Address</th>
                <th class="px-4 py-2">Vcoins</th>
                <th class="px-4 py-2">Power-ups</th>
                <th class="px-4 py-2 first:rounded-tl-xl last:rounded-tr-xl">Actions</th>
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
                    <td class="px-4 py-2">
                        {#each u.powerUps as p}
                            <span class="inline-flex items-center mr-2">
                                <img src={powerUpUrls[p.itemId]} 
                                     alt="Power-up" 
                                     class="h-6 w-6 inline-block mr-1" 
                                     title={p.name} />
                                {p.quantity}
                            </span>
                        {/each}
                    </td>             
                    <td class="px-4 py-2">
                        <button on:click={() => openViewModal(u)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 24 24"><path fill="black" d="M22 3H2c-1.09.04-1.96.91-2 2v14c.04 1.09.91 1.96 2 2h20c1.09-.04 1.96-.91 2-2V5a2.074 2.074 0 0 0-2-2m0 16H2V5h20zm-8-2v-1.25c0-1.66-3.34-2.5-5-2.5s-5 .84-5 2.5V17zM9 7a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 9 12a2.5 2.5 0 0 0 2.5-2.5A2.5 2.5 0 0 0 9 7m5 0v1h6V7zm0 2v1h6V9zm0 2v1h4v-1z"/></svg>
                        </button>
                    </td>
                </tr>
            {/each}
            {/if}
        </tbody>
    </table>
    {#if userListCallResult.totalCount}
    <Pagination totalCount = {userListCallResult.totalCount} {pageNo} on:handlePageChange={handlePageChange}></Pagination>
{/if}
</div>
