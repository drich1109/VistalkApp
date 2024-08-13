<script lang="ts">
    import { redirectIfLoggedIn } from '$lib/shortcuts';
    import { onMount } from 'svelte';
    import {type Section} from './type'

    onMount(async () => {
        await redirectIfLoggedIn(''); // Redirect to login if not logged in
    });

    let sections:Section[] = 
    [{id:1, title:"Section 1", numberOfUnits: 10}, {id:2, title:"Section 2", numberOfUnits: 10},{id:3, title:"Section 3", numberOfUnits: 10},
    {id:4, title:"Section 4", numberOfUnits: 10}, {id:5, title:"Section 5", numberOfUnits: 10},{id:5, title:"Section 5", numberOfUnits: 10},{id:5, title:"Section 5", numberOfUnits: 10},{id:5, title:"Section 5", numberOfUnits: 10},
    ]
</script>

<div class="flex justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg">
    <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">Section and Unit List</p>
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
        <select class="font-['Helvetica'] bg-[#99BC85] text-white py-2 px-3 rounded-xl text-sm shadow-lg hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
            <option class="py-2">Select Language</option>
            <option class="py-2">oopo</option>
        </select>
        <div class="flex gap-4">
            <button class="flex items-center font-['Helvetica'] bg-[#99BC85] text-white py-2 px-3 rounded-xl text-sm shadow-lg hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-white mr-2" width="1em" height="1em" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></g></svg>
                Edit
            </button>
        
            <button class="flex items-center font-['Helvetica'] bg-[#99BC85] text-white py-2 px-3 rounded-xl text-sm shadow-lg hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="text-white mr-2" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M13 6.5V11h4.5v2H13v4.5h-2V13H6.5v-2H11V6.5z"/></svg>
                Add Sec & Unit
            </button>
        </div> 
    </div>
</div>
<div class="flex flex-wrap gap-6 mt-6 justify-center">
    {#each sections as section}
    <button class="bg-white rounded-xl  py-1 px-2 flex-grow basis-[calc(33.33%-64px)] max-w-[calc(33.33%-64px)] transform hover:scale-110 transition-transform duration-300 shadow-lg">
        <span class="flex justify-end">
            <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2">
                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                </g>
            </svg>
        </span>
        <p class="text-4xl font-bold text-center">{section.title}</p>
        <p class="text-sm text-left">{section.numberOfUnits}</p>
    </button>
    {/each}
</div>

<div class="flex justify-center items-center mt-6 bg-white rounded-xl py-2 px-4 shadow-lg">
    <button class="bg-[#99BC85] text-white p-2 rounded-lg shadow-sm hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300 ">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="2" d="M17 2L7 12l10 10"/></svg>
    </button>
    <p class="text-[#99BC85] text-center text-sm mx-4">
        Page 1 of 2
    </p>
    <button class="bg-[#99BC85] text-white p-2 rounded-lg shadow-sm hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300 mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="#fff" stroke-width="2" d="m7 2l10 10L7 22"/></svg>
    </button>
</div>