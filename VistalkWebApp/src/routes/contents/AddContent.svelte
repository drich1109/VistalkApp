<script lang="ts">
    import { createEventDispatcher, onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import type { Content, ContentDto, ContentType, DefinitionDto, ExampleDto, SyllableDto } from './type';
    import { getContentTypes, saveMainContent, getFileByFileName } from './repo';
  
    export let modelOpen: boolean;
    export let isAdd: boolean;
    export let languageId: number;
    export let content:ContentDto;
  
    let contentTypes: ContentType[] = [];
    let syllables = content.syllables;
    let syllableOrderNumber = content.syllables.length > 0 
      ? Math.max(...content.syllables.map(s => s.orderNumber)) + 1 
      : 1;
    let definitions = content.definitions
    let definitionOrderNumber = content.definitions.length > 0 
        ? Math.max(...content.definitions.map(d => d.orderNumber)) + 1 
        : 1;
    let examples = content.examples
    let exampleOrderNumber = content.examples.length > 0 
        ? Math.max(...content.examples.map(e => e.orderNumber)) + 1 
        : 1;  
    const dispatch = createEventDispatcher();
  
    const isAccordionOpen1 = writable(false);
    const isAccordionOpen2 = writable(false);
    const isAccordionOpen3 = writable(false);
  
    const fileInfo = writable<string | null>(null);
  
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
          syllables = [...syllables]
        } else {
          const filePath = file.name;
          content.content.audioPath = filePath.replace('C:\\fakepath\\', '');
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
        content.content.isPlaying = true;

        content.content.audio.onended = () => {
          content.content.isPlaying = false;
        };
      } else {
        content.content.audio.pause();
        content.content.isPlaying = false;
      }
    }
  }
    
  function togglePlayPauseSyllable(sylla: SyllableDto) {
    if (sylla.audio) {
        if (sylla.audio.paused) {
            sylla.audio.play();
            syllables = syllables.map(s => 
                s === sylla ? { ...sylla, isPlaying: true } : s
            );

            sylla.audio.onended = () => {
                syllables = syllables.map(s => 
                    s.orderNumber === sylla.orderNumber ? { ...sylla, isPlaying: false } : s
                );
            };
        } else {
            sylla.audio.pause();
            syllables = syllables.map(s => 
                s === sylla ? { ...sylla, isPlaying: false } : s
            );
        }
    }
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
        contentID: 0,
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

    function removeSyllable(index: number) {
      syllables.splice(index, 1); 
      syllables = [...syllables]; 
    }

    function addDefinition() {
      const newdefinition = initializeDefinition();
      definitions = [...definitions, newdefinition];
      definitionOrderNumber++;
    }

    function removeDefinition(index: number){
      definitions.splice(index, 1); 
      definitions = [...definitions];
    }

    function addExample() {
      const newExample = intiializeExample();
      examples = [...examples, newExample];
      exampleOrderNumber++;
    }

    function removeExample(index: number) {
      examples.splice(index, 1); // Directly modify the array using splice
      examples = [...examples];
    }

    async function saveContent() {
        content.syllables = syllables;

        content.examples = examples;
        content.definitions = definitions;
        if (content.content.contentID == 0) {
          await saveMainContent(content);
        }
        else {
          content.syllables.forEach((syllable) => {
            syllable.contentId = content.content.contentID
        });
        content.examples.forEach((examples) => {
            examples.contentId = content.content.contentID
        });
        content.definitions.forEach((definitions) => {
            definitions.contentID = content.content.contentID
        });
        await saveMainContent(content);
    }

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
                          <select bind:value={content.content.contentTypeId} class="w-full font-['Helvetica'] bg-white text-black py-2 px-3 rounded-lg text-sm border border-gray-300">
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
                                  class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-300 rounded-md "/>
                          </div>
              
                          <div class="mt-2">
                              <label for="translation" class="block text-sm text-black capitalize dark:text-black font-bold">Translation</label>
                              <input 
                                bind:value={content.content.englishTranslation}
                                  id="translation"
                                  placeholder="Translation" 
                                  type="text" 
                                  class="block w-full px-3 py-2 mt-2 text-gray-600 placeholder-gray-400 bg-white border border-gray-300 rounded-md"/>
                          </div>
                          
                          <div class="mt-2">  
                            <label class="inline-flex items-center cursor-pointer">
                                <input bind:checked={content.content.isInDictionary} type="checkbox" class="sr-only peer">
                                <div class="relative w-11 h-6 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-lime-800"></div>
                                <span class="ms-3 text-sm font-medium text-black dark:text-black">Dictionary</span>
                            </label>
                          </div>

                          <!-- File Input Section -->
                          <div class="mt-2">
                            
                              <label for="fileInput" class="block text-sm text-black font-bold">Pronunciation File</label>

                            <!-- Play/Pause Button -->
                            {#if content.content.audio != null}
                            <div class="flex items-justify">
                              <button 
                                  on:click={togglePlayPause} 
                                  class=" mr-2 text-gray-600 focus:outline-none hover:text-gray-700">
                                  {#if content.content.isPlaying}
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 32 32"><path fill="black" d="M14 10h-2v12h2zm6 0h-2v12h2z"/><path fill="black" d="M16 4A12 12 0 1 1 4 16A12 12 0 0 1 16 4m0-2a14 14 0 1 0 14 14A14 14 0 0 0 16 2"/></svg>      
                                  {:else}
                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 20 20"><path fill="black" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07m12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32M7 6l8 4l-8 4z"/></svg>
                                  {/if}
                              </button>
                            <div class="mt-2.5 text-sm text-gray-700">
                            {content.content.audioPath}
                            </div>
                            <div class="flex items-justify">
                              <label for="file" class="py-2 px-3 cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/></svg>
                              </label>
                              <input 
                              type="file" class="file-input" accept=".wav" style="visibility: hidden;" id="file"
                            on:change={(event) => handleFile(event)}/>
                            </div>
                            </div>
                            {:else}
                            <div class="flex items-justify">
                              <label for="file" class="flex mr-2 bg-black text-white text-sm p-1 rounded-md cursor-pointer">Upload File
                                <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/></svg>
                              </label>
                              <input 
                              type="file" class="file-input" accept=".wav" style="visibility: hidden;" id="file"
                            on:change={(event) => handleFile(event)}/>
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
                                  <th class="px-1 py-3 bg-[#99BC85] text-xs font-semibold text-white uppercase tracking-wider">
                                    Action
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {#if syllables.length <= 0}
                                  <tr>
                                    <td colspan="3" class="text-center px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                      No syllables found. <button on:click={addSyllable} class="ml-2 bg-[#99BC85] text-white px-3 py-1 rounded">Add</button>
                                    </td>
                                  </tr>
                                {:else}
                                  {#each syllables as sylla, index}
                                    <tr>
                                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <input type="text" bind:value={sylla.syllableText} class="w-full border border-gray-300 rounded-md py-1 px-2 bg-white text-sm" />
                                      </td>
                                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        {#if sylla.audio != null}
                                        <div class="flex items-justify">
                                          <button 
                                              on:click={() => togglePlayPauseSyllable(sylla)} 
                                              class=" mr-2 text-gray-600 focus:outline-none hover:text-gray-700">
                                              {#if sylla.isPlaying == true}
                                              <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 32 32"><path fill="black" d="M14 10h-2v12h2zm6 0h-2v12h2z"/><path fill="black" d="M16 4A12 12 0 1 1 4 16A12 12 0 0 1 16 4m0-2a14 14 0 1 0 14 14A14 14 0 0 0 16 2"/></svg>      
                                              {:else}
                                              <svg xmlns="http://www.w3.org/2000/svg" width="1.2rem" height="1.2rem" viewBox="0 0 20 20"><path fill="black" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07m12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32M7 6l8 4l-8 4z"/></svg>
                                              {/if}
                                          </button>
                                        <div class="mt-2.5 text-sm text-gray-700">
                                          {sylla.audioPath}
                                        </div>
                                        <div class="flex items-center">
                                          <label for="filesylla{sylla.orderNumber}" class="py-2 px-3 cursor-pointer">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                                              <path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/>
                                            </svg>
                                          </label>
                                          <input 
                                            type="file" class="file-input" accept=".wav" 
                                            style="position: absolute; left: -9999px;" id="filesylla{sylla.orderNumber}"
                                            on:change={(event) => handleFile(event, sylla)}/>
                                        </div>                                        
                                        </div>
                                        {:else}
                                        <div class="flex items-center">
                                          <label for="filesylla{sylla.orderNumber}" class="flex mr-2 bg-black text-white text-sm p-1 rounded-md cursor-pointer">Upload File
                                            <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24"><path fill="currentColor" d="M11 16V7.85l-2.6 2.6L7 9l5-5l5 5l-1.4 1.45l-2.6-2.6V16zm-5 4q-.825 0-1.412-.587T4 18v-3h2v3h12v-3h2v3q0 .825-.587 1.413T18 20z"/></svg>
                                          </label>
                                          <input 
                                          type="file" class="file-input" accept=".wav" style="position: absolute; left: -9999px;"  id="filesylla{sylla.orderNumber}"
                                        on:change={(event) => handleFile(event, sylla)}/>
                                        </div>
                                        {/if}
                                      </td>
                                      <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <button on:click={() => removeSyllable(index)} class="text-black">
                                          <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                                        </button>
                                      </td>
                                    </tr>
                                  {/each}
                                  <tr>
                                    <td colspan="3" class="text-center px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                      <button on:click={addSyllable} class="bg-[#99BC85] text-white px-3 py-1 rounded">Add</button>
                                    </td>
                                  </tr>
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
                                              <th class="px-1 py-3 bg-[#99BC85] text-xs font-semibold text-white uppercase tracking-wider">
                                                Action
                                              </th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                        {#if definitions.length <= 0}
                                        <td colspan="3" class="text-center px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                          No definitions found. <button on:click={addDefinition} class="bg-[#99BC85] text-white px-3 py-1 rounded">Add</button>
                                         </td>
                                       {:else}
                                         {#each definitions as def, index}
                                           <tr>
                                             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                               <input type="text" bind:value={def.nativeDefinition} class="w-full border border-gray-300 rounded-md py-1 px-2 bg-white text-sm" />
                                             </td>
                                             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <input type="text" bind:value={def.englishDefinition} class="w-full border border-gray-300 rounded-md py-1 px-2 bg-white text-sm" />
                                              </td>
                                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <button class="text-black" on:click={() => removeDefinition(index)}>
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                                                </button>
                                              </td>
                                           </tr>
                                         {/each}
                                         <td colspan="3" class="text-center px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                           <button on:click={addDefinition} class="bg-[#99BC85] text-white px-3 py-1 rounded">Add</button>
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
                                                  Native
                                              </th>
                                              <th class="px-5 py-3 bg-[#99BC85] text-left text-xs font-semibold text-white uppercase tracking-wider">
                                                  English
                                              </th>
                                              <th class="px-1 py-3 bg-[#99BC85] text-xs font-semibold text-white uppercase tracking-wider">
                                                Action
                                              </th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                        {#if examples.length <= 0}
                                        <td colspan="3" class="text-center px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                           No examples found. <button on:click={addExample} class="bg-[#99BC85] text-white px-3 py-1 rounded">Add</button>
                                         </td>
                                       {:else}
                                         {#each examples as ex, index}
                                           <tr>
                                             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                               <input type="text" bind:value={ex.nativeExample} class="w-full border border-gray-300 rounded-md py-1 px-2 bg-white text-sm" />
                                             </td>
                                             <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <input type="text" bind:value={ex.englishExample} class="w-full border border-gray-300 rounded-md py-1 px-2 bg-white text-sm" />
                                              </td>
                                              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <button class="text-black" on:click={() => removeExample(index)}>
                                                  <svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/></svg>
                                                </button>
                                              </td>
                                           </tr>
                                         {/each}
                                         <td colspan="3" class="text-center px-5 py-2 border-b border-gray-200 bg-white text-sm">
                                           <button on:click={addExample} class="bg-[#99BC85] text-white px-3 py-1 rounded">Add</button>
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
