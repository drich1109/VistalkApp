<script lang="ts">
    import { redirectIfLoggedIn } from '$lib/shortcuts';
    import { createEventDispatcher, onMount } from 'svelte';
    import type { CallResultDto } from '../../types/types';
    import type { QuestionType, Unit } from './type';
    import { getQuestionTypes, getUnits, unitInactive } from './repo';
    import AddUnit from './AddUnit.svelte';
    import { page } from '$app/stores';
    import Pagination from '$lib/components/Pagination.svelte';
    import QuestionList from './QuestionList.svelte';

    export let sectionId:number;
    export let languageId:number;

    let showModal : boolean = false;
    let isAdd:boolean = false;
    let unit: Unit;
    let searchString:string | null = null;
    let showQuestion:boolean = false;
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
    let pageNo:number =1;
    let questionTypes:QuestionType[]=[];
    let unitId:number = 0

    onMount(async () => {
        await redirectIfLoggedIn('');
        await refresh();
    });

    async function refresh()
    {
        unitCallResult = await getUnits(sectionId, pageNo, searchString);
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

    function handlePageChange(event:CustomEvent) {
        const selectElement = event.detail as HTMLSelectElement;
        pageNo = parseInt(selectElement.toString());
        refresh();
    }

    async function openQuestionList(id:number)
    {
        showQuestion = true;
        unitId = id;
    }

    $: {
        if(searchString != null)
            refresh();
    }

    function closeQuestion()
    {
        showQuestion = false;
    }

    async function setInactive(id:number){ await unitInactive(id); refresh();}

</script>
{#if showModal == true}
    <AddUnit modelOpen = {showModal} {unit} {isAdd} on:close={closeModal} on:refresh={refresh}></AddUnit>
{/if}

{#if showQuestion}
    <QuestionList {languageId} {unitId} on:back={closeQuestion}></QuestionList>
{:else}
<button class="bg-[#99BC85] rounded-lg p-1" on:click={goBackToSection}><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 512 512"><path fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="48" d="M244 400L100 256l144-144M120 256h292"/></svg></button>
<div class="flex justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg">
    <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">Unit List</p>
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
                {#if unitCallResult.totalCount != null && unitCallResult.totalCount > 0}
                {#each units as u}
                <tr class="border-t-2 mx-4" on:click={() => openQuestionList(u.unitID)}>
                    <td class="px-4 py-2">{u.unitNumber}</td>
                    <td class="px-4 py-2">{u.title}</td>
                    <td class="px-4 py-2">{u.description}</td>
                    <td class="px-4 py-2">{u.totalItems}</td>
                    <td class="px-4 py-2">
                        
                        <button on:click={(event) => { event.stopPropagation(); toggleModal(false,u)}}><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 16 16"><path fill="black" d="M15.49 7.3h-1.16v6.35H1.67V3.28H8V2H1.67A1.21 1.21 0 0 0 .5 3.28v10.37a1.21 1.21 0 0 0 1.17 1.25h12.66a1.21 1.21 0 0 0 1.17-1.25z"/><path fill="black" d="M10.56 2.87L6.22 7.22l-.44.44l-.08.08l-1.52 3.16a1.08 1.08 0 0 0 1.45 1.45l3.14-1.53l.53-.53l.43-.43l4.34-4.36l.45-.44l.25-.25a2.18 2.18 0 0 0 0-3.08a2.17 2.17 0 0 0-1.53-.63a2.2 2.2 0 0 0-1.54.63l-.7.69l-.45.44zM5.51 11l1.18-2.43l1.25 1.26zm2-3.36l3.9-3.91l1.3 1.31L8.85 9zm5.68-5.31a.9.9 0 0 1 .65.27a.93.93 0 0 1 0 1.31l-.25.24l-1.3-1.3l.25-.25a.88.88 0 0 1 .69-.25z"/></svg></button>
                        
                        <button on:click={(event) => { event.stopPropagation() ; setInactive(u.unitID);}}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1"/></svg>
                        </button>
                    </td>
                </tr>
                {/each}
                {:else}
                <tr class="border-t-2 mx-4">
                    <td class="px-4 py-2" colspan="5">No Units Found on Section</td>
                </tr>
                {/if}  
        </div>
            {#if unitCallResult.totalCount}
            <Pagination totalCount = {unitCallResult.totalCount} {pageNo} on:handlePageChange={handlePageChange}></Pagination>
            {/if}
{/if}
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