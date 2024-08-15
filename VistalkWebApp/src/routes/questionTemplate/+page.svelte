<script lang='ts'>
    import MultipleChoiceEnglish from '$lib/components/MultipleChoiceEng.svelte';  
    import MultipleChoiceNative from '$lib/components/MultipleChoiceNat.svelte'; 
    import MatchingType from '$lib/components/MatchingType.svelte';

    let showMulEngModal: boolean = false;
    let showMulNatModal: boolean = false;
    let showMatchingType: boolean = false;

    function openMulEnglish() {
        // Ensure that only the English modal is shown
        showMulEngModal = true;
        showMulNatModal = false; // Hide the Native modal if it's open
        showMatchingType = false;
    }
  
    function closeMulEngModal() {
        showMulEngModal = false;
        showMatchingType = false;
    }

    function openMulNative() {
        // Ensure that only the Native modal is shown
        showMulNatModal = true;
        showMulEngModal = false; // Hide the English modal if it's open
        showMatchingType = false;
    }
  
    function closeMulNatModal() {
        showMulNatModal = false;
    }

    function openMatchType() {
        // Ensure that only the English modal is shown
        showMatchingType = true;
        showMulEngModal = false;
        showMulNatModal = false; // Hide the Native modal if it's open
       
    }
  
    function closeMatchType() {
        showMatchingType = false;
       
    }
</script>

<div class="flex justify-between items-center mt-1 bg-white rounded-xl py-4 px-4 shadow-lg">
    <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">Question Templates</p>
</div>

<div class="flex flex-wrap gap-6 mt-28 justify-center">
    <button  
      on:click={openMulEnglish}
      class="bg-white rounded-xl py-1 px-2 flex-grow basis-[calc(33.33%-64px)] max-w-[calc(33.33%-64px)] transform hover:scale-110 transition-transform duration-300 shadow-lg"
    >
      <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">Multiple Choice</p>
      <p class="font-['Helvetica'] text-[#99BC85] text-sm font-bold">English</p>
    </button>

    <button  
      on:click={openMulNative}
      class="bg-white rounded-xl py-1 px-2 flex-grow basis-[calc(33.33%-64px)] max-w-[calc(33.33%-64px)] transform hover:scale-110 transition-transform duration-300 shadow-lg"
    >
      <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">Multiple Choice</p>
      <p class="font-['Helvetica'] text-[#99BC85] text-sm font-bold">Native</p>
    </button>

    <button  
      on:click={openMatchType}
      class="bg-white rounded-xl py-1 px-2 flex-grow basis-[calc(33.33%-64px)] max-w-[calc(33.33%-64px)] transform hover:scale-110 transition-transform duration-300 shadow-lg"
    >
      <p class="font-['Helvetica'] text-[#99BC85] text-xl font-bold">Matching Type</p>
    </button>
</div>

{#if showMulEngModal}
    <MultipleChoiceEnglish modelOpen={showMulEngModal} on:close={closeMulEngModal} />
{/if}

{#if showMulNatModal}
    <MultipleChoiceNative modelOpen={showMulNatModal} on:close={closeMulNatModal} />
{/if}

{#if showMatchingType}
    <MatchingType modelOpen={showMatchingType} on:close={closeMatchType} />
{/if}
