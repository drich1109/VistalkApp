<script lang="ts">
    import { redirectIfLoggedIn } from '$lib/shortcuts';
    import { createEventDispatcher, onMount } from 'svelte';
    import type { CallResultDto } from '../../types/types';
    import type { Unit } from './type';
    import { getUnits } from './repo';
    import AddUnit from './AddUnit.svelte';

    export let sectionId:number;

    let showModal : boolean = false;
    let isAdd:boolean = false;
    let unit: Unit;
    const dispatch = createEventDispatcher();

    let unitCallResult:CallResultDto<Unit[]> = 
    {
        message: "",
        data: [],
        isSuccess: true,    
        data2: [],
        totalCount: 0
    };
    let units:Unit[]=[];

    onMount(async () => {
        await redirectIfLoggedIn('');
        await refresh();
    });

    async function refresh()
    {
        unitCallResult = await getUnits(sectionId);
        units = unitCallResult.data;
    }

    function initalizeUnit(){
        unit = {
            unitID:0,
            unitNumber: 0,
            title: '',
            description: '',
            sectionID:sectionId,
            totalItems: 0
        };
    }

    function toggleModal(check:boolean, specUnit : Unit | null)
    {
        showModal = true;
        isAdd = check;

        if(specUnit)
            unit = specUnit;
        else
            initalizeUnit();
    }

    function closeModal()
    {
        showModal = false;
        initalizeUnit();
    }

function goBackToSection()
{
    dispatch("back");
}
</script>
{#if showModal == true}
    <AddUnit modelOpen = {showModal} {unit} {isAdd} on:close={closeModal} on:refresh={refresh}></AddUnit>
{/if}
<button on:click={goBackToSection}>Back to Section</button>
<div class="flex justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg">
    <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">Unit List</p>
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
        <button on:click={() => toggleModal(true,null)} class="font-['Helvetica'] bg-[#99BC85] text-white py-2 px-3 rounded-xl text-sm shadow-lg hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
            Add Unit
        </button>
    </div>
</div>

<div class="flex mt-6">
    <table class="bg-white w-full shadow-lg rounded-xl">
        <thead class="font-['Cambria'] bg-[#99BC85] text-white  text-center">
            <tr class="first:rounded-t-xl last:rounded-b-xl">
                <th class="px-4 py-2 first:rounded-tl-xl last:rounded-tr-xl">Unit Number</th>
                <th class="px-4 py-2">Title</th>
                <th class="px-4 py-2">Description</th>
                <th class="px-4 py-2">Total Items</th>
                <th class="px-4 py-2 first:rounded-tl-xl last:rounded-tr-xl">Action</th>
            </tr>
        </thead>
        <tbody class="text-center text-sm">
            <tr class="border-t-2 mx-4">
                {#if unitCallResult.totalCount != null && unitCallResult.totalCount > 0}
                {#each units as u}
                <td class="px-4 py-2">{u.unitNumber}</td>
                <td class="px-4 py-2">{u.title}</td>
                <td class="px-4 py-2">{u.description}</td>
                <td class="px-4 py-2">{u.totalItems}</td>
                <td class="px-4 py-2"><button on:click={() => toggleModal(false,u)}>Edit</button></td>
                {/each}
                {:else}
                    <td class="px-4 py-2">No Units Found on Section</td>
                {/if}
            </tr>
        </div>
        <div class=" mt-2  flex justify-center items-center bg-white rounded-xl py-2 px-4 shadow-lg">
            <button class="bg-[#99BC85] text-white p-2 rounded-lg shadow-sm hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="2" d="M17 2L7 12l10 10"/></svg>
            </button>
            <p class="text-[#99BC85] text-center text-sm mx-4">
                Page 1 of 2
            </p>
            <button class="bg-[#99BC85] text-white p-2 rounded-lg shadow-sm hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="2" d="m7 2l10 10L7 22"/></svg>
            </button>
        </div>
        
        
    <style>
        tbody tr:hover{
            background-color: #e0e0e0;
        }

        .logout-button {
        display: flex;
        align-items: center;
        margin-top: auto;
        background-color: white;
        color: #99BC85;
        border: none;
        padding: 10px;
        cursor: pointer;
        border-radius: 4px;
        font-size: 1em;
        transition: background-color 0.3s ease;
    }
    </style>