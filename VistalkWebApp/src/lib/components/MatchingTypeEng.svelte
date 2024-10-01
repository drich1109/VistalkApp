<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type { Content } from '../../routes/section/type';
    import type { QuestionMatchingTypeDto } from '$lib/api/componentType';
    import { save_questionMatch } from '$lib/api/componentRepo';

    export let modelOpen: boolean;
    export let choices: Content[];
    export let mainQuestion: QuestionMatchingTypeDto;

    const dispatch = createEventDispatcher();

    let leftQueries = ['', '', '', ''];
    let rightQueries = ['', '', '', ''];
    let selectedChoices: (Content | undefined)[] = Array(leftQueries.length).fill(undefined);
    let filteredChoices: Content[] = [];
    let dropdownVisibility = Array(leftQueries.length).fill(false);

    function closeModal() {
    modelOpen = false;  // Update the state to close the modal
    closeAllDropdowns();  // Close any open dropdowns when closing the modal
    dispatch('close');
}

    function getFilteredChoices(query: string, side: 'left' | 'right') {
        return choices.filter(choice => {
            if (side === 'left') {
                return choice.englishTranslation.toLowerCase().includes(query.toLowerCase());
            } else {
                return choice.contentText.toLowerCase().includes(query.toLowerCase());
            }
        }).slice(0, 5);
    }

    function selectChoice(choice: Content, index: number) {
        selectedChoices[index] = choice;
        leftQueries[index] = choice.englishTranslation;
        rightQueries[index] = choice.contentText;
        
        // Hide the dropdown after selecting a choice
        dropdownVisibility[index] = false;
    }

    async function saveContent() {
        mainQuestion.choice1 = selectedChoices[0]?.contentID ?? 0;
        mainQuestion.choice2 = selectedChoices[1]?.contentID ?? 0;
        mainQuestion.choice3 = selectedChoices[2]?.contentID ?? 0;
        mainQuestion.choice4 = selectedChoices[3]?.contentID ?? 0;
        mainQuestion.match1 = mainQuestion.choice1;
        mainQuestion.match2 = mainQuestion.choice2;
        mainQuestion.match3 = mainQuestion.choice3;
        mainQuestion.match4 = mainQuestion.choice4;
        await save_questionMatch(mainQuestion);
        closeModal();
    }

    function handleInputChange(index: number, side: 'left' | 'right', event: Event) {
        const target = event.target as HTMLInputElement;
        if (side === 'left') {
            leftQueries[index] = target.value;
        } else {
            rightQueries[index] = target.value;
        }
        filteredChoices = getFilteredChoices(target.value, side);
        dropdownVisibility[index] = true;
    }

    function handleRightInputFocus(index: number) {
        filteredChoices = getFilteredChoices(rightQueries[index], 'right');
        dropdownVisibility[index] = true;
    }

    function closeAllDropdowns() {
        dropdownVisibility = dropdownVisibility.map(() => false);
    }

    // Close dropdowns when clicking outside
    function handleClickOutside(event: MouseEvent) {
        const target = event.target as HTMLElement;
        if (!target.closest('.relative')) {
            closeAllDropdowns();
        }
    }

    // Add event listener for clicks outside the dropdown
    window.addEventListener('click', handleClickOutside);

    // Clean up event listener on component destroy
    import { onDestroy } from 'svelte';
    onDestroy(() => {
        window.removeEventListener('click', handleClickOutside);
    });
</script>

{#if modelOpen}
<div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen px-4 text-center md:items-center sm:block sm:p-0">
      <div on:click={closeModal} class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-40" aria-hidden="true"></div>

      <div class="inline-block w-full max-w-xl p-8 my-20 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl 2xl:max-w-2xl"
          style="opacity: {modelOpen ? 1 : 0}; transform: {modelOpen ? 'translateY(0)' : 'translateY(4rem)'};">
        <div class="flex items-center justify-between space-x-4">
          <h1 class="text-xl font-medium text-gray-800">
            Multiple Choice English
          </h1>
          <button on:click={closeModal} class="text-gray-600 focus:outline-none hover:text-gray-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        <form class="mt-5">
          <div class="mt-5">
            <label for="question" class="block text-sm text-black capitalize dark:text-black">Question</label>
            <textarea bind:value={mainQuestion.questionText}
                id="question" 
                placeholder="Question" 
                class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40"
            ></textarea>
          </div>

          {#each [1, 2, 3, 4] as i (i)}
          <div class="mt-4 relative flex items-center">
            <!-- Matching Question Inputs -->
            <div class="relative w-full flex items-center space-x-2">
              <input
                  id="choice-left-{i}" 
                  type="text" 
                  autocomplete="off"
                  placeholder={`Match ${i}`} 
                  bind:value={leftQueries[i-1]}
                  on:input={(event) => handleInputChange(i-1, 'left', event)}
                  class="block w-1/2 px-3 py-2 text-gray placeholder-gray bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40"
              />
              <span class="text-gray-600">=</span>
              <input
                  id="choice-right-{i}" 
                  type="text" 
                  autocomplete="off"
                  placeholder={`Answer ${i}`} 
                  value={rightQueries[i-1]}
                  on:focus={() => handleRightInputFocus(i-1)}
                  readonly
                  class="block w-1/2 px-3 py-2 text-gray placeholder-gray bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40"
              />
            </div>

            {#if leftQueries[i-1].length > 0 && dropdownVisibility[i-1]}
              <ul class="absolute left-2 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-10 top-full list-none">
                {#each getFilteredChoices(leftQueries[i-1], 'left') as choice}
                  <li 
                      class="px-3 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
                      on:click={() => selectChoice(choice, i-1)}
                  >
                    {choice.englishTranslation}
                  </li>
                {/each}
              </ul>
            {/if}
            {#if rightQueries[i-1].length > 0 && dropdownVisibility[i-1]}
              <ul class="absolute right-2 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-10 top-full list-none">
                {#each filteredChoices as choice}
                  <li 
                      class="px-3 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
                      on:click={() => selectChoice(choice, i-1)}
                  >
                    {choice.contentText}
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
          {/each}

          <div class="flex justify-end mt-6">
            <button 
                on:click={saveContent}
                type="button" 
                class="px-3 py-2 text-sm tracking-wide text-white capitalize transition-colors duration-200 transform bg-black rounded-md dark:bg-black dark:hover:bg-black dark:focus:bg-black hover:bg-black focus:outline-none focus:bg-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
            >
              Save Question
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
{/if}
