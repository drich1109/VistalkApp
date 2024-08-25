<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import type { Content, ContentDto, ContentType, DefinitionDto, ExampleDto, SyllableDto } from './type';
    import { getContentTypes, saveMainContent } from './repo';
  
    export let modelOpen: boolean;
    export let isAdd: boolean;
    export let languageId: number;
    export let content:ContentDto;
  
    let contentTypes: ContentType[] = [];
    let syllables = content.syllables;
    let syllableOrderNumber: number = 1;
    let definitions = content.definitions
    let definitionOrderNumber:number = 1;
    let examples = content.examples
    let exampleOrderNumber:number = 1;
  
    const dispatch = createEventDispatcher();
  
    const isAccordionOpen1 = writable(false);
    const isAccordionOpen2 = writable(false);
    const isAccordionOpen3 = writable(false);
  
    const fileInfo = writable<string | null>(null);
  
    let audio: HTMLAudioElement | null = null;
    const isPlaying = writable(false);
  
    function handleFile(event: Event, syllable?: SyllableDto) {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];
  
      if (file) {
        const url = URL.createObjectURL(file);
        if (syllable) {
          syllable.audioPath = file.name;
          syllable.audio = new Audio(url);
          syllable.file = file
        } else {
          fileInfo.set(`${file.name}`);
          content.content.audioPath = file.name;
          content.content.audio = new Audio(url);
          content.content.file = file;
          content.content.audio.onended = () => {
            isPlaying.set(false);
          };
        }
      } else {
        if (syllable) {
          syllable.audioPath = "";
          syllable.audio = null;
        } else {
          fileInfo.set(null);
          content.content.file = null;
          content.content.audioPath = "";
          content.content.audio = null;
        }
      }
    }
  
    function togglePlayPause() {
      if (content.content.audio) {
        if (content.content.audio.paused) {
            content.content.audio.play();
          isPlaying.set(true);
        } else {
            content.content.audio.pause();
          isPlaying.set(false);
        }
      }
    }
  
    function togglePlayPauseSyllable(sylla:SyllableDto) {
        if(sylla.audio){
            if (sylla.isPlaying) {
            sylla.audio.pause();
            sylla.isPlaying = false;
            } else {
            sylla.audio.play();
            sylla.isPlaying = true;
            }
        }
        sylla = { ...sylla, isPlaying: !sylla.isPlaying };
        syllables = syllables.map(s => (s === sylla ? sylla : s));
  }
  
    function closeModal() {
      dispatch('close');
    }
  
    onMount(async () => {
      const contentTypeCallResult = await getContentTypes();
      contentTypes = contentTypeCallResult.data;
    });
  
    function initializeSyllable() {
      return {
        id:0,
        contentId: 0,
        syllableText: "",
        audioPath: "",
        orderNumber: syllableOrderNumber,
        isPlaying: false,
        audio: null,
        file:null
      };
    }

    function initializeDefinition() {
      return {
        id:0,
        contentId: 0,
        nativeDefinition:"",
        englishDefinition:"",
        orderNumber: definitionOrderNumber
      };
    }
  
    function intiializeExample() {
      return {
        id:0,
        contentId: 0,
        nativeExample:"",
        englishExample:"",
        orderNumber: exampleOrderNumber
      };
    }

    function addSyllable() {
      const newSyllable = initializeSyllable();
      syllables = [...syllables, newSyllable];
      syllableOrderNumber++;
    }

    function addDefinition() {
      const newdefinition = initializeDefinition();
      definitions = [...definitions, newdefinition];
      definitionOrderNumber++;
    }

    function addExample() {
      const newExample = intiializeExample();
      examples = [...examples, newExample];
      exampleOrderNumber++;
    }

    async function saveContent() {
    content.syllables = syllables;
    content.syllables.forEach((syllable) => {
        syllable.audioPath = syllable.audioPath.replace('C:\\fakepath\\', '');
    });
    content.examples = examples;
    content.definitions = definitions;

    await saveMainContent(content);

    dispatch('refresh');
    dispatch('close');
}
  </script>
  
{#if modelOpen}
<div 
  class="fixed inset-0 z-50 overflow-y-auto" 
  aria-labelledby="modal-title" 
  role="dialog" 
  aria-modal="true">

  <div class="flex items-end justify-center min-h-screen px-4 text-center md:items-center sm:block sm:p-0">
      <div 
          on:click={closeModal}
          class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-40" 
          aria-hidden="true"
      ></div>

      <div 
          class="inline-block w-full max-w-4xl p-6 my-20 overflow-hidden text-left transition-all transform bg-white rounded-lg shadow-xl 2xl:max-w-6xl"
          style="opacity: {modelOpen ? 1 : 0}; transform: {modelOpen ? 'translateY(0)' : 'translateY(4rem)'};"
      >
          <div class="flex items-center justify-between space-x-4">
              <h1 class="text-xl font-medium text-gray-800">{isAdd ? "Create Unit" : "Edit Unit"}</h1>

              <button 
                  on:click={closeModal}
                  class="text-gray-600 focus:outline-none hover:text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
              </button>
          </div>
          
          <div class="grid grid-cols-2 gap-6">
              <!-- Column 1 -->
              <div>
                  <div class="flex flex-wrap items-center justify-center gap-6">
                      <div class="flex flex-col items-left gap-6 mt-16">
                        <div class="flex gap-4">
                          <select bind:value={content.content.contentTypeId} class="w-full font-['Helvetica'] bg-white text-black py-2 px-3 rounded-xl text-sm shadow-lg border border-black">
                            <option class="py-2" value={0}>--Select Content Type--</option>
                            {#each contentTypes as content}
                              <option class="py-2" value={content.contentTypeID}>{content.typeName}</option>
                              {/each}
                          </select>
                      </div>
              
                          <div class="mt-2">
                              <label for="contentText" class="block text-sm text-black capitalize dark:text-black font-bold">Content Text</label>
                              <input 
                                  id="contentText"
                                  bind:value={content.content.contentText}
                                  placeholder="Content Text" 
                                  type="text" 
                                  class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40"/>
                          </div>
              
                          <div class="mt-2">
                              <label for="translation" class="block text-sm text-black capitalize dark:text-black font-bold">Translation</label>
                              <input 
                                bind:value={content.content.englishTranslation}
                                  id="translation"
                                  placeholder="Translation" 
                                  type="text" 
                                  class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-200 rounded-md focus:border-indigo-400 focus:outline-none focus:ring focus:ring-indigo-300 focus:ring-opacity-40"/>
                          </div>
              
                          <!-- File Input Section -->
                          <div class="mt-4">
                            <label for="fileInput" class="block text-sm text-black font-bold">Pronunciation File</label>
                            <input 
                                type="file" class="file-input" accept=".mp3"
                                on:change={(event) => handleFile(event)}/>
      
                            <!-- Play/Pause Button -->
                            {#if $fileInfo}
                            <div class="flex">
                            <button 
                                on:click={togglePlayPause} 
                                class="mt-3 mr-2 text-gray-600 focus:outline-none hover:text-gray-700">
                                {#if $isPlaying}
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 32 32"><path fill="black" d="M14 10h-2v12h2zm6 0h-2v12h2z"/><path fill="black" d="M16 4A12 12 0 1 1 4 16A12 12 0 0 1 16 4m0-2a14 14 0 1 0 14 14A14 14 0 0 0 16 2"/></svg>                                {/if}
                                {#if !$isPlaying}
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 20 20"><path fill="black" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07m12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32M7 6l8 4l-8 4z"/></svg>
                                {/if}
                            </button>
                            <div class="mt-3 text-sm text-gray-700">
                            {$fileInfo}
                            </div>
                            </div>
                            {/if}
                        </div>
                      </div>
                  </div>
              </div>

              <!-- Column 2 -->
              <div>
                  <div class="flex flex-col items-start gap-6 mt-16">
                      <!-- Accordion 1 -->
                      <div class="w-full">
                          <button
                              class="w-full bg-[#99BC85] text-white py-3 px-4 rounded-xl font-bold text-left flex justify-between items-center"
                              on:click={() => isAccordionOpen1.set(!$isAccordionOpen1)}
                          >
                              Syllables
                              <span class="transform transition-transform duration-300">
                                  {#if $isAccordionOpen1} - {/if}
                                  {#if !$isAccordionOpen1} + {/if}
                              </span>
                          </button>
      
                          {#if $isAccordionOpen1}
                          <div class="mt-2 bg-white rounded-xl shadow-lg overflow-x-auto">
                            <table class="min-w-full leading-normal">
                              <thead>
                                <tr>
                                  <th class="px-5 py-3 bg-[#99BC85] text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Syllable
                                  </th>
                                  <th class="px-5 py-3 bg-[#99BC85] text-left text-xs font-semibold text-white uppercase tracking-wider">
                                    Audio Path
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {#if syllables.length <= 0}
                                 <td colspan="3" class="text-center">
                                    <button on:click={addSyllable}>Add</button>
                                  </td>
                                {:else}
                                  {#each syllables as sylla}
                                    <tr>
                                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <input type="text" bind:value={sylla.syllableText} class="w-full border-none bg-white text-sm" />
                                      </td>
                                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <input type="file" class="file-input" accept=".mp3" on:change={(event) => handleFile(event, sylla)} bind:value={sylla.audioPath}/>
                                        {#if sylla.audio != null}
                                            <button on:click={() => togglePlayPauseSyllable(sylla)}>
                                            {#if sylla.isPlaying}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 32 32"><path fill="black" d="M14 10h-2v12h2zm6 0h-2v12h2z"/><path fill="black" d="M16 4A12 12 0 1 1 4 16A12 12 0 0 1 16 4m0-2a14 14 0 1 0 14 14A14 14 0 0 0 16 2"/></svg>                           
                                            {:else}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 20 20"><path fill="black" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07m12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32M7 6l8 4l-8 4z"/></svg>
                                            {/if}
                                            </button>
                                        {/if}
                                      </td>
                                    </tr>
                                  {/each}
                                  <td colspan="3" class="text-center">
                                    <button on:click={addSyllable}>Add</button>
                                  </td>
                                {/if}
                              </tbody>
                            </table>
                          </div>
                        {/if}
                      </div>
      
                      <!-- Accordion 2 -->
                      <div class="w-full">
                          <button
                              class="w-full bg-[#99BC85] text-white py-3 px-4 rounded-xl font-bold text-left flex justify-between items-center"
                              on:click={() => isAccordionOpen2.set(!$isAccordionOpen2)}
                          >
                              Definition
                              <span class="transform transition-transform duration-300">
                                  {#if $isAccordionOpen2} - {/if}
                                  {#if !$isAccordionOpen2} + {/if}
                              </span>
                          </button>
      
                          {#if $isAccordionOpen2}
                              <div class="mt-2 bg-white rounded-xl shadow-lg overflow-x-auto">
                                  <table class="min-w-full leading-normal">
                                      <thead>
                                          <tr>
                                              <th class="px-5 py-3 bg-[#99BC85] text-left text-xs font-semibold text-white uppercase tracking-wider">
                                                  NATIVE DEFINITION
                                              </th>
                                              <th class="px-5 py-3 bg-[#99BC85] text-left text-xs font-semibold text-white uppercase tracking-wider">
                                                  ENGLISH DEFINITION
                                              </th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                        {#if definitions.length <= 0}
                                        <td colspan="3" class="text-center">
                                           <button on:click={addDefinition}>Add</button>
                                         </td>
                                       {:else}
                                         {#each definitions as def}
                                           <tr>
                                             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                               <input type="text" bind:value={def.nativeDefinition} class="w-full border-none bg-white text-sm" />
                                             </td>
                                             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <input type="text" bind:value={def.englishDefinition} class="w-full border-none bg-white text-sm" />
                                              </td>
                                           </tr>
                                         {/each}
                                         <td colspan="3" class="text-center">
                                           <button on:click={addDefinition}>Add</button>
                                         </td>
                                       {/if}
                                      </tbody>
                                  </table>
                              </div>
                          {/if}
                      </div>
      
                      <!-- Accordion 3 -->
                      <div class="w-full">
                          <button
                              class="w-full bg-[#99BC85] text-white py-3 px-4 rounded-xl font-bold text-left flex justify-between items-center"
                              on:click={() => isAccordionOpen3.set(!$isAccordionOpen3)}
                          >
                              Example
                              <span class="transform transition-transform duration-300">
                                  {#if $isAccordionOpen3} - {/if}
                                  {#if !$isAccordionOpen3} + {/if}
                              </span>
                          </button>
      
                          {#if $isAccordionOpen3}
                              <div class="mt-2 bg-white rounded-xl shadow-lg overflow-x-auto">
                                  <table class="min-w-full leading-normal">
                                      <thead>
                                          <tr>
                                              <th class="px-5 py-3 bg-[#99BC85] text-left text-xs font-semibold text-white uppercase tracking-wider">
                                                  Example
                                              </th>
                                              <th class="px-5 py-3 bg-[#99BC85] text-left text-xs font-semibold text-white uppercase tracking-wider">
                                                  Notes
                                              </th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                        {#if examples.length <= 0}
                                        <td colspan="3" class="text-center">
                                           <button on:click={addExample}>Add</button>
                                         </td>
                                       {:else}
                                         {#each examples as ex}
                                           <tr>
                                             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                               <input type="text" bind:value={ex.nativeExample} class="w-full border-none bg-white text-sm" />
                                             </td>
                                             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <input type="text" bind:value={ex.englishExample} class="w-full border-none bg-white text-sm" />
                                              </td>
                                           </tr>
                                         {/each}
                                         <td colspan="3" class="text-center">
                                           <button on:click={addExample}>Add</button>
                                         </td>
                                       {/if}
                                      </tbody>
                                  </table>
                              </div>
                          {/if}
                      </div>
                  </div>
              </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end gap-4 mt-6">
              <button 
                  class="px-4 py-2 text-sm tracking-wide text-white capitalize transition-colors duration-200 transform bg-black rounded-md dark:bg-black dark:hover:bg-black dark:focus:bg-black hover:bg-black focus:outline-none focus:bg-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                  on:click={saveContent}
              >
                  {isAdd ? "Save" : "Update"}
              </button>
        
          </div>
      </div>
  </div>
</div>
{/if}
