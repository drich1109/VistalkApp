<script lang="ts">
    import { createEventDispatcher } from "svelte";

    export let totalCount:number
    export let pageNo:number;
    
    const dispatch = createEventDispatcher();

    function handlePageChange(pageNo:number)
    {
        dispatch('handlePageChange', pageNo)
    }
</script>

<div class="flex bottom-2 justify-center items-center mt-3 bg-white rounded-xl py-2 px-2 shadow-lg">
    <button on:click={() => handlePageChange(pageNo -1)} disabled={pageNo <= 1} class="bg-[#99BC85] text-white p-2 rounded-lg shadow-sm hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="none" stroke="#fff" stroke-width="2" d="M17 2L7 12l10 10"/>
        </svg>
    </button>
    <p class="text-[#99BC85] text-center text-sm mx-4">
        Page {pageNo} of {Math.ceil(totalCount / 15)}
    </p>
    
    <button on:click={() => handlePageChange(pageNo + 1)} disabled={pageNo >= Math.ceil(totalCount / 15)} class="bg-[#99BC85] text-white p-2 rounded-lg shadow-sm hover:bg-[#BFD8AF] transform hover:scale-110 transition-transform duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
            <path fill="none" stroke="#fff" stroke-width="2" d="m7 2l10 10L7 22"/>
        </svg>
    </button>
</div>  