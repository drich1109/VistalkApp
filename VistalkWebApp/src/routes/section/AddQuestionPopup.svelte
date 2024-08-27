<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { QuestionType, Content} from "./type";
    import MultipleChoiceEnglish from '$lib/components/MultipleChoiceEng.svelte';  
    import MultipleChoiceNative from '$lib/components/MultipleChoiceNat.svelte'; 
    import MatchingType from "$lib/components/MatchingType.svelte";
    import { getQuestionTypes, getChoices } from './repo';
    import type { QuestionMatchingTypeDto, QuestionMultipleDto } from "$lib/api/componentType";

    export let questionTypes: QuestionType[];
    export let showModal: boolean;
    export let languageId:number;
    export let unitId:number;

    let typeValue: number = 0;
    let showNativeMultiple: boolean = false;
    let showEnglishMultiple: boolean = false;
    let showAudioType: boolean = false;
    let showMatchingType: boolean = false;
    let contents: Content[] = [];

    let mainQuestion: QuestionMultipleDto = {
        questionID: 0,
        imagePath: null,
        audioPath: null,
        questionText: '',
        file: null,
        questionTypeID: 0,
        unitId: unitId,
        choice1: 0,
        choice2: 0,
        choice3: 0,
        choice4: 0,
        correctChoice: 0,
    };

    let matchQuestion: QuestionMatchingTypeDto = 
    {
        questionID: 0,
        questionText:"",
        questionTypeID:0,
        unitId:unitId,
        choice1: 0,
        choice2: 0,
        choice3: 0,
        choice4: 0,
        match1: 0,
        match2: 0,
        match3: 0,
        match4: 0
    }


    const dispatch = createEventDispatcher();

    function handleClose() {
        dispatch('close');
    }

    async function clickContinue() {
        const contentListCallResult = await getChoices(languageId);
        contents = contentListCallResult.data;

        if (typeValue !== 0) {
            mainQuestion.questionTypeID = typeValue;
            matchQuestion.questionTypeID = typeValue;
            switch (typeValue) {
                case 2:
                    showNativeMultiple = true;
                    showEnglishMultiple = false;
                    showAudioType = false;
                    showMatchingType = false;
                    break;
                case 1:
                    showNativeMultiple = false;
                    showEnglishMultiple = true;
                    showAudioType = false;
                    showMatchingType = false;
                    break;
                case 4:
                    showNativeMultiple = false;
                    showEnglishMultiple = false;
                    showAudioType = true;
                    showMatchingType = false;
                    break;
                case 3:
                    showNativeMultiple = false;
                    showEnglishMultiple = false;
                    showAudioType = false;
                    showMatchingType = true;
                    break;
                default:
                    break;
            }
            showModal = false;
        }
    }

    function closeModal() {
        showNativeMultiple = false;
        showEnglishMultiple = false;
        showAudioType = false;
        showMatchingType = false;
        showModal=true;
    }

    async function refresh() {
        const questionCallResult = await getQuestionTypes();
        questionTypes = questionCallResult.data;
    }

</script>

{#if showEnglishMultiple}
<MultipleChoiceEnglish modelOpen={showEnglishMultiple} choices={contents} mainQuestion={mainQuestion} on:close={closeModal} />
{/if}

{#if showNativeMultiple}
<MultipleChoiceNative modelOpen={showNativeMultiple} choices={contents} mainQuestion={mainQuestion} on:close={closeModal} />
{/if}

{#if showMatchingType}
<MatchingType modelOpen={showMatchingType} choices={contents} mainQuestion={matchQuestion} on:close={closeModal} />
{/if}

{#if showModal}
<div 
    class="fixed inset-0 z-50 overflow-y-auto" 
    aria-labelledby="modal-title" 
    role="dialog" 
    aria-modal="true">
    
    <div class="flex items-center justify-center min-h-screen px-4 text-center">
      
        <div 
            on:click={handleClose}
            class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-40" 
            aria-hidden="true"
        ></div>
    
        <div 
            class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-center transition-all transform bg-white rounded-lg shadow-xl"
            style="opacity: {showModal ? 1 : 0}; transform: {showModal ? 'translateY(0)' : 'translateY(4rem)'};"
        >
            <div class="flex items-center justify-between space-x-4 mb-4">
                <h1 class="text-xl font-medium text-gray-800">Select Type of Question</h1>
        
                <button 
                    on:click={handleClose}
                    class="text-gray-600 focus:outline-none hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
            </div>
            
            <div class="field mb-4">
                <div class="control">
                    <div class="select w-full">
                        <select class="w-full text-center p-2 border border-gray-300 rounded-md" bind:value={typeValue}>
                            <option value={0} class="text-left">--SELECT--</option>
                            {#each questionTypes as qt}
                                <option value={qt.typeID} class="text-left" >{qt.typeName}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
            
            <button 
                on:click={clickContinue} 
                class="mt-4 bg-black text-white p-2 rounded">
                Continue
            </button>
        </div>
    </div>
</div>

{/if}
