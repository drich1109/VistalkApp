<script lang="ts">
    import { redirectIfLoggedIn } from '$lib/shortcuts';
    import { onMount } from 'svelte';
    import {type Section} from './type'
    import AddSection from './AddSection.svelte';
    import type { CallResultDto } from '../../types/types';
    import { getSections, sectionInactive } from './repo';
    import Unit from './Unit.svelte';
    import type { Language } from '../type';
    import { getLanguages } from '../repo';

    let showModal:boolean = false;
    let isAdd:boolean = false;
    let section: Section;
    let showUnits:boolean = false;
    let currentValue: number = 1;

    function initializeSection(){
        section = {
            sectionId:0,
            sectionNumber: 0,
            title: '',
            isPremium: false,
            description: '',
            languageID:currentValue
        };
    }

    let sectionCallResult:CallResultDto<Section[]> = 
    {
        message: "",
        data: [],
        isSuccess: true,    
        data2: [],
        totalCount: 0
    };
    let sections: Section[] = [];

    let languageCallResult:CallResultDto<Language[]> = 
    {
        message: "",
        data: [],
        isSuccess: true,    
        data2: [],
        totalCount: 0
    };
    let languages:Language[] = [];
    let sectionId:number = 0;

    onMount(async () => {
        await redirectIfLoggedIn('');
        languageCallResult = await getLanguages();
        languages = languageCallResult.data;
        await getSectionDisplay();
    });

    function toggleModal(check:boolean, specSection : Section | null)
    {
        showModal = true;
        isAdd = check;
        if(specSection)
            section = specSection;
        else
            initializeSection();
    }
 
    function toggleButton(sectionID:number)
    {
        sectionId = sectionID;
        showUnits = true;
    }
    function closeModal()
    {
        showModal = false;
        initializeSection();
    }

    function closeUnit()
    {
        showUnits = false;
        getSectionDisplay();
    }

    async function getSectionDisplay()
    {   
        sectionCallResult = await getSections(currentValue);
        sections = sectionCallResult.data;
    }

    async function setInactive(id:number){ await sectionInactive(id); getSectionDisplay();}
</script>

{#if showModal}
    <AddSection modelOpen = {showModal} {isAdd} {section} languageID={currentValue} on:close={closeModal} on:refresh={getSectionDisplay}></AddSection>
{/if}
{#if showUnits}
     <Unit {sectionId} languageId={currentValue} on:back={closeUnit}></Unit>
 {:else}
<div class="flex justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg">
    <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">Sections</p>

    <div class="flex gap-4">
        <select bind:value={currentValue} on:change={getSectionDisplay} class="font-['Helvetica'] bg-[#99BC85] text-white py-2 px-3 rounded-xl text-sm shadow-lg ">
            {#each languages as lang}
            <option class="py-2" value={lang.languageID}>{lang.name}</option>
            {/each}
        </select>
        <div class="flex gap-4">

            <button on:click={() => toggleModal(true, null)} class="flex items-center font-['Helvetica'] bg-[#99BC85] text-white py-2 px-3 rounded-xl text-sm shadow-lg hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-white mr-2" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M13 6.5V11h4.5v2H13v4.5h-2V13H6.5v-2H11V6.5z"/></svg>
                Add Section
            </button>
        </div> 
    </div>
</div>
<div class="flex flex-wrap gap-6 mt-6 justify-center">
    {#each sections as section}
    <button on:click={() => toggleButton(section.sectionId)} class="bg-white rounded-xl  py-1 px-2 flex-grow basis-[calc(33.33%-64px)] max-w-[calc(33.33%-64px)] transform hover:scale-110 transition-transform duration-300 shadow-lg">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
       <span on:click={(event) => { event.stopPropagation(); toggleModal(false, section); }} class="flex justify-end">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                </g>
            </svg>
            
            <span on:click={(event) => { event.stopPropagation() ; setInactive(section.sectionId);}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h4a1 1 0 1 1 0 2h-1.069l-.867 12.142A2 2 0 0 1 17.069 22H6.93a2 2 0 0 1-1.995-1.858L4.07 8H3a1 1 0 0 1 0-2h4zm2 2h6V4H9zM6.074 8l.857 12H17.07l.857-12zM10 10a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1m4 0a1 1 0 0 1 1 1v6a1 1 0 1 1-2 0v-6a1 1 0 0 1 1-1"/></svg>
            </span>

        </span>
        
        <p class="text-4xl font-bold text-center">{section.title}</p>
        <p class="text-sm text-left">{section.description}</p>
    </button>
    {/each}
</div>
{/if}
