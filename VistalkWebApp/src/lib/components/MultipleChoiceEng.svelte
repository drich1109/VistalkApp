<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import type { Content } from '../../routes/section/type';
  import type { QuestionMultipleDto } from '$lib/api/componentType';
    import { saveMainContent } from '../../routes/contents/repo';
    import { saveQuestionMultipleChoice } from '$lib/api/componentRepo';

  export let modelOpen: boolean;
  export let choices: Content[];
  export let mainQuestion: QuestionMultipleDto;
  export let searchQueries: string[];
  export let fileType: 'audio' | 'image' | null;
  export let fileUrl:string;

  const dispatch = createEventDispatcher();

  let selectedChoices: (Content | undefined)[] = Array(searchQueries.length).fill(undefined);
  let prevent: boolean[] = Array(searchQueries.length).fill(false); 
  let audioElement: HTMLAudioElement | null = new Audio(fileUrl) || null;
  let lastFile: File | null = mainQuestion.file;
  let lasttype:  'audio' | 'image' | null = fileType;

  onMount(async () => {
    searchQueries.forEach((query, index) => {
      const matchingChoice = choices.find(choice => choice.englishTranslation.toLowerCase() === query.toLowerCase());
      if (matchingChoice) {
        selectedChoices[index] = matchingChoice;
      }
    });
  });

  function closeModal() {
      mainQuestion.file = null
      dispatch('close');
  }

  function getFilteredChoices(query: string) {
      return choices.filter(choice => 
          choice.englishTranslation.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5);
  }

  function selectChoice(choice: Content, index: number) {
    if(selectedChoices)
      selectedChoices[index] = choice;
      searchQueries[index] = choice.englishTranslation;
      
  }

  function handleFileUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      mainQuestion.file = target.files[0];
      fileUrl = URL.createObjectURL(mainQuestion.file);

      if (fileType === 'audio') {
        if (audioElement) {
          audioElement.pause();
          audioElement.src = fileUrl;
          audioElement.load();
        } else {
          audioElement = new Audio(fileUrl);
        }
      }
    }
  }

  function selectFileType(type: 'audio' | 'image') {
    fileType = type;
    if(fileType == lasttype && lastFile != null)
    {
      mainQuestion.file = lastFile;

      fileUrl = URL.createObjectURL(mainQuestion.file);

      if (fileType === 'audio') {
        if (audioElement) {
          audioElement.pause();
          audioElement.src = fileUrl;
          audioElement.load();
        } else {
          audioElement = new Audio(fileUrl);
        }
      }
    }
    else{
    mainQuestion.file = null
    }
  }

  async function saveContent() {
    if(selectedChoices){
      mainQuestion.choice1 = selectedChoices[0]?.contentID ?? 0;
      mainQuestion.choice2 = selectedChoices[1]?.contentID ?? 0;
      mainQuestion.choice3 = selectedChoices[2]?.contentID ?? 0;
      mainQuestion.choice4 = selectedChoices[3]?.contentID ?? 0;
      switch (mainQuestion.correctChoice) {
                case 2:
                    mainQuestion.correctChoice = mainQuestion.choice2 
                    break;
                case 1:
                    mainQuestion.correctChoice = mainQuestion.choice1 
                    break;
                case 4:
                    mainQuestion.correctChoice = mainQuestion.choice4
                    break;
                case 3:
                    mainQuestion.correctChoice = mainQuestion.choice3
                    break;
                default:
                    break;
            }
      if(fileType == 'image' && mainQuestion.file)
      {
        mainQuestion.imagePath = mainQuestion.file.name;
        mainQuestion.audioPath = null;
      }
      else if (fileType == 'audio' && mainQuestion.file){
        mainQuestion.audioPath = mainQuestion.file.name;
        mainQuestion.imagePath = null;
      }
      await saveQuestionMultipleChoice(mainQuestion);
      closeModal();
    }
  }
  function handleInputChange(index:number) {
    if(selectedChoices)
    {
        if (searchQueries[index].length === 0) {
            selectedChoices[index] = undefined;
            prevent[index] = true;
        }
      }
}

function togglePlayPause() {
    if (audioElement) {
      if (audioElement.paused) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
      audioElement.onended = () => {
      audioElement = new Audio(fileUrl); 
    };    }
  }

</script>

{#if modelOpen}
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen px-4 text-center md:items-center sm:block sm:p-0">
          <div on:click={closeModal} class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-40" aria-hidden="true"></div>

          <div class="inline-block w-full max-w-xl p-8 my-20 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl 2xl:max-w-2xl"
              style="opacity: {modelOpen ? 1 : 0}; transform: {modelOpen ? 'translateY(0)' : 'translateY(4rem)'};">
              <div class="flex items-center justify-between space-x-4">
                  <h1 class="text-xl font-medium text-gray-800">
                      Multiple Choice (English Choices)
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

                  <div class="container mx-auto px-4 py-6">
                    <div class="bg-white shadow-lg rounded-lg p-6">
                      <div class="mt-1">
                        <label class="block text-sm text-black capitalize dark:text-black mb-2">Select File Type:</label>
                        <div class="flex space-x-4">
                          <button type="button"
                                  on:click={() => selectFileType('image')}
                                  class="px-3 py-2 text-sm text-white bg-black rounded-md focus:outline-none hover:bg-gray-800">Image</button>
                          <button type="button"
                                  on:click={() => selectFileType('audio')}
                                  class="px-3 py-2 text-sm text-white bg-black rounded-md focus:outline-none hover:bg-gray-800">Audio</button>
                        </div>
                      </div>
                  
                      {#if fileType}
                        <div class="mt-5">
                          <div class="flex items-justify">
                            <label for="file" class="flex mr-2 bg-black text-white text-sm p-1 rounded-md cursor-pointer">Upload File
                              <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/></svg>
                            </label>
                            <input 
                            type="file" class="file-input" accept={fileType === 'audio' ? 'audio/*' : 'image/*'} style="visibility: hidden;" id="file"
                          on:change={(event) => handleFileUpload(event)}/>
                          </div>
                          
                          {#if fileType === 'image' && mainQuestion.file}
                            <img src={fileUrl} alt="Uploaded Image" class="mt-2 max-w-xs rounded-md">
                            <p class="mt-2 text-sm text-gray-600">File: {mainQuestion.file.name}</p>
                          {:else if fileType === 'audio' && mainQuestion.file}
                            <div class="flex items-center mt-2">
                              <button on:click={togglePlayPause}
                                class=" mr-2 text-gray-600 focus:outline-none hover:text-gray-700">
                                {#if audioElement && !audioElement.paused}
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 32 32"><path fill="black" d="M14 10h-2v12h2zm6 0h-2v12h2z"/><path fill="black" d="M16 4A12 12 0 1 1 4 16A12 12 0 0 1 16 4m0-2a14 14 0 1 0 14 14A14 14 0 0 0 16 2"/></svg>      
                                {:else if audioElement  && audioElement.paused}
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 20 20"><path fill="black" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07m12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32M7 6l8 4l-8 4z"/></svg>
                                {/if}
                              </button>
                              <p class="text-sm text-gray-600">{mainQuestion.file.name}</p>
                            </div>
                          {/if}
                        </div>
                      {/if}
                    </div>
                  </div>
                  
                  
                  {#each [1, 2, 3, 4] as i (i)}
                    <div class="mt-4 relative flex items-center">
                      <!-- Radio Button -->
                      <input 
                        type="radio" 
                        id="radio-choice-{i}" 
                        name="correctChoice" 
                        checked={mainQuestion.correctChoice === (selectedChoices[i-1]?.contentID ?? 0) && mainQuestion.correctChoice !== 0}
                        on:change={() => {
                          const choice = selectedChoices[i-1];
                          if (choice) {
                            mainQuestion.correctChoice = choice.contentID;
                          }
                        }}
                      
                        class="mr-2"
                      />
                      
                      <div class="relative w-full">
                        <input
                          id="choice{i}" 
                          type="text" 
                          placeholder="Search and select content" 
                          bind:value={searchQueries[i-1]}
                          on:input={() => handleInputChange(i-1)}
                          autocomplete="off"
                          class= "block w-full px-3 py-2 mt-2 ml-2 text-gray placeholder-gray bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40"
                          style="background-color: {mainQuestion.correctChoice === (selectedChoices[i-1]?.contentID ?? 0) && mainQuestion.correctChoice !== 0 ? 'darkseagreen' : 'white'};"
                          />
                        
                        {#if searchQueries[i-1].length > 0 && !selectedChoices[i-1]}
                          <ul class="absolute left-2 w-full bg-white border border-gray-200 rounded-md shadow-lg mt-1 z-10 top-full">
                            {#each getFilteredChoices(searchQueries[i-1]) as choice}
                              <li 
                                class="px-3 py-2 text-gray-700 cursor-pointer hover:bg-gray-100"
                                on:click={() => selectChoice(choice, i-1)}
                              >
                                {choice.englishTranslation}
                              </li>
                            {/each}
                          </ul>
                        {/if}
                      </div>  
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